// ==UserScript==
// @name         Auto Blum DICHVUONLINE.VN
// @namespace    http://tampermonkey.net/
// @version      16-10-2024
// @description  AUTO click vào bí ngô trong game Blum cập nhật mới nhất 2024
// @match        https://telegram.blum.codes/*
// @grant        none
// ==/UserScript==

(() => {
    if (window.BlumAC) return;
    window.BlumAC = true;
  
    const config = {
      autoPlay: true,
      pumpkinColor: [224, 119, 60], // nhặt full anh em muốn nhặt ích lại thì thay đổi thông số thành [255, 165, 0]
      tolerance: 10, 
      playButtonSelector: "button.is-primary, .play-btn",
      canvasSelector: "canvas",
      playCheckInterval: 5000,
      objectCheckInterval: 100,
      excludedArea: { top: 70 }
    };
  
    if (config.autoPlay) {
      setInterval(() => {
        const playButton = document.querySelector(config.playButtonSelector);
        if (playButton && playButton.textContent.toLowerCase().includes("play")) {
          playButton.click();
        }
      }, config.playCheckInterval);
    }
  
    setInterval(() => {
      const canvas = document.querySelector(config.canvasSelector);
      if (canvas) detectAndClickObjects(canvas);
    }, config.objectCheckInterval);
  
    function detectAndClickObjects(canvas) {
      const { width, height } = canvas;
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, width, height);
      const pixels = imageData.data;
  
      for (let y = config.excludedArea.top; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];
  
          if (isInPumpkinRange(r, g, b, config.pumpkinColor, config.tolerance)) {
            simulateClick(canvas, x, y);
          }
        }
      }
    }
    // Auto Blum DICHVUONLINE.VN
    function isInPumpkinRange(r, g, b, pumpkinColor, tolerance) {
      return pumpkinColor.every((color, i) => Math.abs([r, g, b][i] - color) <= tolerance);
    }
  
    function simulateClick(canvas, x, y) {
      const eventProps = { clientX: x, clientY: y, bubbles: true };
      ['click', 'mousedown', 'mouseup'].forEach(event => {
        canvas.dispatchEvent(new MouseEvent(event, eventProps));
      });
    }
  })();
  