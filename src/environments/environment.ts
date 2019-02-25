// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCgDAnL5dGp0cfaCa_kL5HnEQ1e-shoNE4",
    authDomain: "gojsdiagram.firebaseapp.com",
    databaseURL: "https://gojsdiagram.firebaseio.com",
    projectId: "gojsdiagram",
    storageBucket: "gojsdiagram.appspot.com",
    messagingSenderId: "750103345386"
  }
};
