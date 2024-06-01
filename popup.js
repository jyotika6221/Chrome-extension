document.addEventListener("DOMContentLoaded", function () {
  const questionInput = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const codeInput = document.getElementById("code");
  const linkInput = document.getElementById("link");
  const addCardButton = document.getElementById("add-card");
  const flashcardsContainer = document.getElementById("flashcards");
  const removeAllButton = document.getElementById("remove-all");
  const imageInput = document.getElementById("image");

  // Load flashcards from storage
  chrome.storage.sync.get(["flashcards"], function (result) {
    const flashcards = result.flashcards || [];
    flashcards.forEach((flashcard) => addFlashcardToDOM(flashcard));
  });

  addCardButton.addEventListener("click", function () {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const code = codeInput.value.trim();
    const link = linkInput.value.trim();

    if ((question || answer || code || link) && (!code || codeIsValid(code))) {
      const flashcard = { question, answer, code, link };
      addFlashcardToDOM(flashcard);
      saveFlashcard(flashcard);
      questionInput.value = "";
      answerInput.value = "";
      codeInput.value = "";
      linkInput.value = "";
    } else {
      alert("Please enter valid data.");
    }
  });

  removeAllButton.addEventListener("click", function () {
    removeAllFlashcards();
  });

  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageSrc = e.target.result;
        // You can handle the image data here
      };
      reader.readAsDataURL(file);
    }
  });

  function addFlashcardToDOM(flashcard) {
    const flashcardElement = document.createElement("div");
    flashcardElement.className = "flashcard";
    flashcardElement.innerHTML = `<p><strong>Q:</strong> ${flashcard.question}</p><p><strong>A:</strong> ${flashcard.answer}</p>`;
    if (flashcard.code) {
      flashcardElement.innerHTML += `<pre><code>${flashcard.code}</code></pre>`;
    }
    if (flashcard.link) {
      flashcardElement.innerHTML += `<p><strong>Link:</strong> <a href="${flashcard.link}" target="_blank">${flashcard.link}</a></p>`;
    }
    flashcardsContainer.appendChild(flashcardElement);

    // Add event listener for delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      removeFlashcard(flashcardElement, flashcard);
    });
    flashcardElement.appendChild(deleteButton);

    // Add event listener for edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.addEventListener("click", function () {
      editFlashcard(flashcardElement, flashcard);
    });
    flashcardElement.appendChild(editButton);
  }

  function saveFlashcard(flashcard) {
    chrome.storage.sync.get(["flashcards"], function (result) {
      const flashcards = result.flashcards || [];
      flashcards.push(flashcard);
      chrome.storage.sync.set({ flashcards });
    });
  }

  function removeAllFlashcards() {
    chrome.storage.sync.set({ flashcards: [] });
    flashcardsContainer.innerHTML = ""; // Clear the flashcards container
  }

  function removeFlashcard(flashcardElement, flashcard) {
    const question = flashcard.question;
    const answer = flashcard.answer;
    chrome.storage.sync.get(["flashcards"], function (result) {
      const flashcards = result.flashcards || [];
      const index = flashcards.findIndex(
        (card) => card.question === question && card.answer === answer
      );
      if (index !== -1) {
        flashcards.splice(index, 1);
        chrome.storage.sync.set({ flashcards });
        flashcardElement.remove();
      }
    });
  }

  function editFlashcard(flashcardElement, flashcard) {
    const newQuestion = prompt("Enter new question:", flashcard.question);
    const newAnswer = prompt("Enter new answer:", flashcard.answer);

    if (newQuestion !== null && newAnswer !== null) {
      flashcard.question = newQuestion.trim();
      flashcard.answer = newAnswer.trim();

      // Update the DOM
      const questionParagraph =
        flashcardElement.querySelector("p:nth-child(1)");
      const answerParagraph = flashcardElement.querySelector("p:nth-child(2)");
      questionParagraph.textContent = `Q: ${flashcard.question}`;
      answerParagraph.textContent = `A: ${flashcard.answer}`;

      // Save the updated flashcard
      saveFlashcard(flashcard);
    }
  }

  function codeIsValid(code) {
    // Add validation logic for code snippets if needed
    return true;
  }
});
