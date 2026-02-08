# PrimeVideo-Intro

A Chrome extension that plays a custom cinematic intro video when you visit Amazon Prime Video, adding a theatrical feel to your viewing experience.

## Features

- **Cinematic Intro**: Plays a custom intro video (`intro.mp4`) when loading Prime Video.
- **Seamless Integration**: Hides the page content initially to prevent flashes of unstyled content.
- **Smart Playback**: By default, plays only once per session (configurable).
- **Settings Popup**: Toggle the splash screen on/off and control whether it plays on every visit.

## Installation

Since this extension is not yet published on the Chrome Web Store, you can install it manually in developer mode:

1.  **Clone or Download** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** using the toggle switch in the top right corner.
4.  Click the **Load unpacked** button that appears in the top left.
5.  Select the folder containing this extension's files (where `manifest.json` is located).

The extension should now be installed and active!

## Usage

1.  Visit [Prime Video](https://www.primevideo.com) or the [Amazon Video page](https://www.amazon.com/gp/video/).
2.  The intro video will play automatically.
3.  **Click anywhere** on the video to unmute if the browser blocks autoplay sound.
4.  Click the extension icon in your browser toolbar to access settings:
    - **Enable Splash**: Turn the intro on or off.
    - **Play Every Visit**: If disabled, the intro plays only once per browser session.

> **Note**: For the audio to play automatically without user interaction, you may need to adjust your browser's site settings. Go to the Amazon Prime Video site, click the lock icon in the address bar -> `Site settings` -> change **Sound** from `Automatic (default)` to `Allow`.

## Configuration

You can customize the extension by editing the source files:

- **Video**: Replace `intro.mp4` with your own video file (keep the filename the same or update `manifest.json` and `content.js`).

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
