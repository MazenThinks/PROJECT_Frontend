// Apply slicing to all paragraphs with class 'slicingText'
var paragraphs = document.querySelectorAll(".slicingText");
paragraphs.forEach((paragraph) => {
  if (paragraph.textContent.length > 70) {
    paragraph.textContent = paragraph.textContent.slice(0, 70) + "...";
  }
});
