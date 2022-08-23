// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "create-rectangles":
      const nodes: SceneNode[] = [];
      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      break;
    case "export-tailwind":
      const textStyles = figma.getLocalTextStyles();
      let _textStyles: any = {};
      textStyles.forEach(({ fontSize, lineHeight, letterSpacing, name }) => {
        _textStyles[name.toLowerCase().replace(/\s/gi, "-")] = [
          `${fontSize}px`,
          (lineHeight as any).value
            ? {
                lineHeight: `${(lineHeight as any).value / 100 || 0}em`,
                letterSpacing: `${letterSpacing.value / 100}em`,
              }
            : {
                letterSpacing: `${letterSpacing.value / 100}em`,
              },
        ];
      });

      console.log("Text Styles: ", _textStyles);

      break;
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
