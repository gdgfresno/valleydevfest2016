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
    }

    // Signs-out
    var signOut = function() {
      // Sign out of Firebase.
      return this.auth.signOut();
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
      return this.auth.currentUser;
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
