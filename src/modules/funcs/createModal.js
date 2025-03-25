export default function createModal(title, content) {
  const modal = document.createElement("div");
  modal.classList.add("log-modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("log-modal-content");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => document.body.removeChild(modal);

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = title;

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(content);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
  modal.style.display = "block";
}
