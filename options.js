document.addEventListener("DOMContentLoaded", function () {
  const themeSelect = document.getElementById("theme");
  const saveButton = document.getElementById("save");

  // Load saved options
  chrome.storage.sync.get(["theme"], function (result) {
    const savedTheme = result.theme;
    if (savedTheme) {
      themeSelect.value = savedTheme;
    }
  });

  // Save options when button is clicked
  saveButton.addEventListener("click", function () {
    const selectedTheme = themeSelect.value;
    chrome.storage.sync.set({ theme: selectedTheme });
  });
});
