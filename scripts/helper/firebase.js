/**
 * Firebase authentication, database and storage functions
 */

HOVERBOARD.Firebase = HOVERBOARD.Firebase || (function () {

    'use strict';

    // Sets up shortcuts to Firebase features and initiate firebase auth.
    var initFirebase = function() {
      // Shortcuts to Firebase SDK features.
      this.auth = firebase.auth();
      this.database = firebase.database();
      this.storage = firebase.storage();
      // Initiates Firebase auth and listen to auth state changes.
      this.ratingsRef = null;
      this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
      this.provider = null;
      this.pendingCred = null;
    }

    var getProviderForProviderStr = function (providerStr) {
      switch (providerStr) {
        case "google": return firebase.auth.GoogleAuthProvider.PROVIDER_ID;
        case "facebook": return firebase.auth.FacebookAuthProvider.PROVIDER_ID;
        case "twitter": return firebase.auth.TwitterAuthProvider.PROVIDER_ID;
        case "github": return firebase.auth.GithubAuthProvider.PROVIDER_ID;
      }
      return null;
    }

    var getProviderForProviderId = function(providerId) {
      switch(providerId) {
        case firebase.auth.GoogleAuthProvider.PROVIDER_ID: return new firebase.auth.GoogleAuthProvider();
        case firebase.auth.FacebookAuthProvider.PROVIDER_ID: return new firebase.auth.FacebookAuthProvider();
        case firebase.auth.TwitterAuthProvider.PROVIDER_ID: return new firebase.auth.TwitterAuthProvider();
        case firebase.auth.GithubAuthProvider.PROVIDER_ID: return new firebase.auth.GithubAuthProvider();
      }
      return null;
    }

    // Signs-in
    var signIn = function(providerId) {
      var provider = getProviderForProviderId(providerId);
      var that = this;
      return this.auth.signInWithPopup(provider).catch(function(error) {

        // An error happened.
        if (error.code === 'auth/account-exists-with-different-credential') {
          HOVERBOARD.Analytics.trackEvent('firebase', 'sign_in_attempt_with_other_credential', providerId);
          // Step 2.
          // User's email already exists.
          // The pending GitHub credential.
          that.pendingCred = error.credential;
          // The provider account's email address.
          var email = error.email;
          // Get registered providers for this email.
          that.auth.fetchProvidersForEmail(email).then(function(providers) {
            // Step 3.
            if (providers[0] === 'password') {
              HOVERBOARD.Analytics.trackEvent('firebase', 'sign_in_attempt_with_email_password', 'notimplemented');
              HOVERBOARD.Elements.Template.$.toast.showMessage("Not yet implemented");
              // Asks the user his password.
              /// TODO:
              // ...
              return;
            }
            // All the other cases are external providers.
            that.provider = providers[0];
            HOVERBOARD.Analytics.trackEvent('firebase', 'sign_in_prompting_for_redirect', providerId);
            HOVERBOARD.Elements.Template.openAuthRedirect();
            // ... redirectedSignIn
          });
        }
      }).then(function(userCred) {
        HOVERBOARD.Analytics.trackEvent('firebase', 'sign_in_worked_first_shot', userCred.user.uid, providerId);
      });
    }

    var redirectedSignIn = function() {
      var provider = getProviderForProviderId(this.provider);
      // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
      // so in real scenario you should ask the user to click on a "continue" button
      // that will trigger the signInWithPopup.
      var that = this;
      HOVERBOARD.Analytics.trackEvent('firebase', 'sign_in_redirecting', this.provider);
      this.auth.signInWithPopup(provider).then(function(result) {
        // Remember that the user may have signed in with an account that has a different email
        // address than the first one. This can happen as Firebase doesn't control the provider's
        // sign in flow and the user is free to login using whichever account he owns.
        // Step 4b.
        // Link to credential.
        // As we have access to the pending credential, we can directly call the link method.
        result.user.link(that.pendingCred).then(function() {
          // Account successfully linked to the existing Firebase user.
          //goToApp();
          HOVERBOARD.Analytics.trackEvent('firebase', 'sign_in_account_linked', that.provider);
        });
      });
    }

    // Signs-out
    var signOut = function(sourceComponentName) {
      HOVERBOARD.Analytics.trackEvent('firebase', 'sign_out_attempt', sourceComponentName);
      // Sign out of Firebase.
      return this.auth.signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        HOVERBOARD.Analytics.trackEvent('firebase', 'signout_error', 'firebase');
        HOVERBOARD.Elements.Template.$.toast.showMessage("Couldn't sign out");
      });
    }

    var onAuthStateChanged = function(user) {
      if (user) { // User is signed in!
        HOVERBOARD.Analytics.trackEvent('firebase', 'signed_in', 'handler');
        this.ratingsRef = this.database.ref('ratings');
        HOVERBOARD.Elements.Template.adjustSignedIn(user);
      } else { // User is signed out!
        HOVERBOARD.Analytics.trackEvent('firebase', 'signed_out', 'handler');
        this.ratingsRef = null;
        HOVERBOARD.Elements.Template.adjustSignedIn(null);
      }
    }

    // Returns true if user is signed-in. Otherwise false.
    var checkSignedIn = function() {
      return this.auth ? this.auth.currentUser : null;
    }

    // Returns true if user is signed-in. Otherwise false and displays a message.
    var checkSignedInWithMessage = function() {
      if (this.checkSignedIn()) {
        return true;
      }

      HOVERBOARD.Elements.Template.$.toast.showMessage('Please sign-in first');
      return false;
    }

    var castRating = function(sessionId, ratingCategory, ratingValue) {
      // HOVERBOARD.Elements.Template.$.toast.showMessage("The conference haven't started yet");
      // Add a new rating entry to the Firebase Database.
      var user = this.auth.currentUser;
      this.ratingsRef.push({
        session: sessionId,
        category: ratingCategory,
        rating: ratingValue,
        name: user.displayName,
        uid: user.uid,
        email: user.email,
        time: Date.now()
      }).then(function() {
        HOVERBOARD.Analytics.trackEvent('session', 'rating', ratingCategory, ratingValue);
      }.bind(this)).catch(function(error) {
        HOVERBOARD.Analytics.trackEvent('session', 'rating_failure', ratingCategory, ratingValue);
        console.error('Error writing rating to Firebase Database', error);
      });
    }

    return {
      initFirebase : initFirebase,
      getProviderForProviderStr: getProviderForProviderStr,
      signIn : signIn,
      redirectedSignIn: redirectedSignIn,
      signOut : signOut,
      onAuthStateChanged : onAuthStateChanged,
      castRating: castRating,
      checkSignedIn : checkSignedIn,
      checkSignedInWithMessage : checkSignedInWithMessage
    };
  }());
