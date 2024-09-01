/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontSize: {
        'sm-custom': '0.8rem', // Define custom font size
        'base-custom': '0.9rem', // Another example for base size
      }
    },
  },
  plugins: [],
}

// module.exports = {
//   theme: {
//     extend: {
//       fontSize: {
//         'sm-custom': '0.8rem', // Define custom font size
//         'base-custom': '0.9rem', // Another example for base size
//       }
//     },
//   },
//   plugins: [],
// }
