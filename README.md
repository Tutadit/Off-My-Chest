# Off My Chest

## How to run

First install dependencies:

```
npm install
```
Once dependencies are installed you can run the development server using:
```
npm run
```

Note: You only need to install once

## Current structure

We will be devloping within the `src` folder, in it you find:
- `components` - Directory containing all of our custom components
- `database` - API for accessing data
- `index.js` - Where our app is bootstrapped


Each component has an `index.js` and an `index.css` file, the js file contains the js and html for the component, the css file containd styling for the component.

### Current components

I have made 4 components thus far:

- `App`
- `Audio`
- `Bubble`
- `Home`

#### `App` Component

The app component utilizes `react-router` to set up two pages for our app. The home page `/` and the audio detail page `/audio/:auidoID`. The home page is the `Home` component, the audio page is the `Audio` component.

I have integrated the bubbles and comment section for our app as well. The home page

## What to do

- Implement `database/index.js` methods to properly connect with the database and return appropiate data.
- Style and complete the `Home` component, we should add an "Off your Chest" title and style it as well.
- Style and complete the `Audio` component

