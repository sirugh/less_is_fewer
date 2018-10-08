# Jump

<figure class="game_container">
  <iframe width="800" height="600" src="https://storage.googleapis.com/gamejam2018-218817.appspot.com/index.html" frameborder="0"></iframe>
</figure>

To play this game:

1. Check out the repo.
2. `npm install`
3. `npm start`
4. http://localhost:8080

Enjoy!

# Contribute

Looking for help with level design! All it takes is a few props on a config with coordinates and boom!

Here's an example level
```js
import LevelGenerator from './generator';

const config = {
  key: '9001', // the number of your level (just add one to the last)
  player: { x: 100, y: 450 },
  exit: { x: 700, y: 500 },
  platforms: [
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 700, y: 550, texture: 'black_platform'_vertical }
  ],
  colorSwitches: [
    { x: 400, y: 350 }
  ],
  gravitySwitches: [
    { x: 250, y: 350, direction: 'up' } // the direction
  ],
  text: 'MY LEVEL'
}

export default LevelGenerator(config);
```

# TODO

- [ ] Add rotation instead of both horizontal and vertical platforms.
- [ ] More levels
- [ ] High scores
- [ ] Better level config handling (key shouldn't be necessary)
- [ ] Other colors
- [ ] Things that kill you besides touching the boundaries
- [ ] Moving platforms
- [ ] Moving things that kill you besides touching the boundaries
- [ ] All the things
<3
