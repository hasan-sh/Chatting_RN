# Chatting_RN

This app has no backend. However, I built it using firebase.
> Check [firebase](https://console.firebase.google.com/u/0/) out to get started.

## Installation

After you clone this repository, you should create `firebase.js` file in the root of the application.

The `firebase.js` should have the credintial of your database in which this chat app will base its content on.

### How to get the credentials?
  1. Go to [firebase](https://console.firebase.google.com/u/0/).
  2. Add a new project. *(you can name it whatever you want)*
  3. Find the settings of your project and click on `Add firebase to your web app`.
  ``` 
  // This looks something like this:
    const config = {
      apiKey: "SOME_KEY",
      authDomain: "PROJECT_DOMAIN",
      databaseURL: "DATABASE_URL",
      projectId: "PROJECT_ID",
      storageBucket: "SOME_BUCKET",
      messagingSenderId: "SOME_ID"
    };
    firebase.initializeApp(config);
  ```
  4. Then copy&paste that into your local `firebase.js` file, and **DON'T** forget to export firebase
  > ...
  > export default firebase
   
   After you've created the `firebase.js` file, you can install the dependencies: 
   > `npm install`
   Then you can run the app
   > `npm start`
   
   Then Expo will bundle your app, create a tunnel, and give you a QR code that you can scan through your Expo app on your android.
   > Download [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent) on your mobile phone.
   
   *Have fun:)*
