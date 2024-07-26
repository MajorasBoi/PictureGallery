const modalContainers = document.querySelectorAll(".modal-container");
const addPictureButton = document.querySelector("button");
const addPictureForm = document.getElementById("add-picture-form");
const imageSection = document.querySelector(".image-section");

modalContainers.forEach((modalContainer) => {
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      modalContainer.style.display = "none";
    }
  });
});

function createPictureElement(picture, index) {
  const imageAndDescription = document.createElement("div");
  imageAndDescription.className = "image-and-description";

  const img = document.createElement("img");
  img.src = `data:image/jpeg;base64,${picture.image}`;
  img.alt = `Image with title "${picture.title}"`;

  const descriptionContainer = document.createElement("div");
  descriptionContainer.className = "description-container";

  const h3 = document.createElement("h3");
  h3.textContent = picture.title;

  const p = document.createElement("p");
  p.textContent = picture.description;

  const iconsContainer = document.createElement("div");
  iconsContainer.className = "icons-container";

  const editIcon = document.createElement("img");
  editIcon.className = "pic-icons";
  editIcon.src = "svg/edit.png";
  editIcon.alt = "Edit icon";
  editIcon.id = index;
  editIcon.addEventListener("click", editPicture);

  const deleteIcon = document.createElement("img");
  deleteIcon.className = "pic-icons";
  deleteIcon.src = "svg/delete.png";
  deleteIcon.alt = "Delete icon";
  deleteIcon.id = index;
  deleteIcon.addEventListener("click", deletePicture);

  // Append children
  descriptionContainer.appendChild(h3);
  descriptionContainer.appendChild(p);

  iconsContainer.appendChild(editIcon);
  iconsContainer.appendChild(deleteIcon);

  imageAndDescription.appendChild(img);
  imageAndDescription.appendChild(descriptionContainer);
  imageAndDescription.appendChild(iconsContainer);

  return imageAndDescription;
}

function editPicture(event) {
  const editForm = document.getElementById("edit-picture-form");

  const editIcon = event.target;
  const pictureId = editIcon.id;

  const pictures = JSON.parse(localStorage.getItem("pictures"));
  const pictureToEdit = pictures[pictureId];

  document.getElementById("titleToEdit").value = pictureToEdit.title;
  document.getElementById("descriptionToEdit").value =
    pictureToEdit.description;
  modalContainers[1].style.display = "flex";

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTitle = document.getElementById("titleToEdit").value;
    const newDescription = document.getElementById("descriptionToEdit").value;

    pictureToEdit.title = newTitle;
    pictureToEdit.description = newDescription;

    localStorage.setItem("pictures", JSON.stringify(pictures));
    imageSection.innerHTML = "";
    loadPictures();

    modalContainers[1].style.display = "none";
  });
}

function deletePicture(event) {
  const deleteIcon = event.target;
  const pictureId = deleteIcon.id;

  const pictures = JSON.parse(localStorage.getItem("pictures"));
  const newPictures = pictures.filter(
    (picture, index) => index !== parseInt(pictureId)
  );

  localStorage.setItem("pictures", JSON.stringify(newPictures));
  imageSection.innerHTML = "";
  loadPictures();
}

function loadPictures() {
  const pictures = JSON.parse(localStorage.getItem("pictures")) || [];
  if (pictures.length == 0) return;

  pictures.map((picture, index) => {
    const pictureElement = createPictureElement(picture, index);
    imageSection.appendChild(pictureElement);
  });
}

async function addPicture() {
  // gets the info from the form
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];

  // creates a FileReader instance
  const reader = new FileReader();

  // defines a callback function to handle the file read
  reader.onload = () => {
    const imageDataUrl = reader.result;

    // converts the image data to a base64 string keeping the second part of the array
    const base64String = imageDataUrl.split(",")[1];

    // stores that info in a variable
    const pictureData = {
      title,
      description,
      image: base64String,
    };

    // verifies if the variable pictures in LocalStorage exists,
    // if not creates an empty array, stores the data and then pushes it into the LocalStorage
    const pictures = JSON.parse(localStorage.getItem("pictures")) || [];
    const index = pictures.length;
    pictures.push(pictureData);
    localStorage.setItem("pictures", JSON.stringify(pictures));

    const pictureElement = createPictureElement(pictureData, index);
    imageSection.appendChild(pictureElement);
  };

  // reads the file as a data URL
  reader.readAsDataURL(image);
}

addPictureButton.addEventListener("click", () => {
  modalContainers[0].style.display = "flex";
});

addPictureForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // avoid sending the form

  await addPicture();

  // goes back to the main content
  modalContainers[0].style.display = "none";

  // cleans the inputs values
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image").value = "";
});

loadPictures();
