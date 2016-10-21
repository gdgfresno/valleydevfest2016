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
    }

    // Signs-in
    var signIn = function() {
      // Sign in Firebase using popup auth and Google as the identity provider.
      var provider = new firebase.auth.GoogleAuthProvider();
      return this.auth.signInWithPopup(provider);

      // var provider = new firebase.auth.FacebookAuthProvider();
      // var that = this;
      // return this.auth.signInWithPopup(provider).catch(function(error) {
      //   // An error happened.
      //   if (error.code === 'auth/account-exists-with-different-credential') {
      //     // Step 2.
      //     // User's email already exists.
      //     // The pending GitHub credential.
      //     var pendingCred = error.credential;
      //     // The provider account's email address.
      //     var email = error.email;
      //     // Get registered providers for this email.
      //     that.auth.fetchProvidersForEmail(email).then(function(providers) {
      //       // Step 3.
      //       // If the user has several providers,
      //       // the first provider in the list will be the "recommended" provider to use.
      //       if (providers[0] === 'password') {
      //         HOVERBOARD.Elements.Template.$.toast.showMessage(
      //           "Not yet implemented");
      //         // Asks the user his password.
      //         // In real scenario, you should handle this asynchronously.
      //         /// TODO:
      //         // var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
      //         // auth.signInWithEmailAndPassword(email, password).then(function(user) {
      //         //   // Step 4a.
      //         //   return user.link(pendingCred);
      //         // }).then(function() {
      //         //   // GitHub account successfully linked to the existing Firebase user.
      //         //   goToApp();
      //         // });
      //         return;
      //       }
      //       // All the other cases are external providers.
      //       // Construct provider object for that provider.
      //       // TODO: implement getProviderForProviderId.
      //       // var provider = getProviderForProviderId(providers[0]);
      //       var provider = providers[0];
      //       // At this point, you should let the user know that he already has an account
      //       // but with a different provider, and let him validate the fact he wants to
      //       // sign in with this provider.
      //       HOVERBOARD.Elements.Template.$.toast.showMessage(
      //         "Signing in...");

      //       // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
      //       // so in real scenario you should ask the user to click on a "continue" button
      //       // that will trigger the signInWithPopup.
      //       that.auth.signInWithPopup(provider).then(function(result) {
      //         // Remember that the user may have signed in with an account that has a different email
      //         // address than the first one. This can happen as Firebase doesn't control the provider's
      //         // sign in flow and the user is free to login using whichever account he owns.
      //         // Step 4b.
      //         // Link to GitHub credential.
      //         // As we have access to the pending credential, we can directly call the link method.
      //         result.user.link(pendingCred).then(function() {
      //           // GitHub account successfully linked to the existing Firebase user.
      //           //goToApp();
      //         });
      //       });
      //     });
      //   }

      // });
    }

    // Signs-out
    var signOut = function() {
      // Sign out of Firebase.
      return this.auth.signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        HOVERBOARD.Analytics.trackEvent('firebase', 'signout_error', 'firebase');
        HOVERBOARD.Elements.Template.$.toast.showMessage(
          "Couldn't sign out");
      });
    }

    var onAuthStateChanged = function(user) {
      if (user) { // User is signed in!
        this.ratingsRef = this.database.ref('ratings');
      } else { // User is signed out!
        this.ratingsRef = null;
      }
      this.fireBaseUIContainer.removeAttribute('hidden');
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

      HOVERBOARD.Elements.Template.$.toast.showMessage(
        'Please sign-in first');
      return false;
    }

    var castRating = function(sessionId, ratingCategory, ratingValue) {
      HOVERBOARD.Elements.Template.$.toast.showMessage(
        "The conference haven't started yet");

      // Add a new rating entry to the Firebase Database.
      // var user = this.auth.currentUser;
      // this.ratingsRef.push({
      //   session: sessionId,
      //   category: ratingCategory,
      //   rating: ratingValue,
      //   name: user.displayName,
      //   uid: user.uid,
      //   email: user.email,
      //   time: Date.now()
      // }).then(function() {
      //   HOVERBOARD.Analytics.trackEvent('session', 'rating', ratingCategory, ratingValue);
      // }.bind(this)).catch(function(error) {
      //   HOVERBOARD.Analytics.trackEvent('session', 'rating_failure', ratingCategory, ratingValue);
      //   console.error('Error writing rating to Firebase Database', error);
      // });
    }

    return {
      initFirebase : initFirebase,
      signIn : signIn,
      signOut : signOut,
      onAuthStateChanged : onAuthStateChanged,
      castRating: castRating,
      checkSignedIn : checkSignedIn,
      checkSignedInWithMessage : checkSignedInWithMessage
    };
  }());
