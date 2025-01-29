### How to Setup & Run

1. `git clone https://github.com/rhudaj/RebetP2PSlider.git`
2. `npm install`
3. `npm run start`

### Dependencies

- lottie-react: for displaying the provided animation JSON files
- react, react-dom: to use react for development
- react-scripts: to run with `npm run start`
- sass: my chosen method for styling (css with nicer easier syntax)
- typescript: my prefered development language

### Design Choices & Modifications

1. Modifed glowing_circle.json since there was a missing asset.
2. Removed glowing_right_arrows.json. For right arrows, I used glowing_left_arrows.json, and apply a css tranform to flip the orientation.
3. CSS files define generic layout/styling choices. Anything that depends on logic (i.e. which side the orb is on) is set inline.