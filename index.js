import { menuArray } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
const ordersArray = [];

document.addEventListener("click", function (e) {
  if (e.target.dataset.menu) {
    handleMenuClick(e.target.dataset.menu);
  } else if (e.target.dataset.remove) {
    handleRemoveClick(e.target.dataset.remove);
  } else if (e.target.className === "order-btn") {
    showPaymentModal();
  }
});

function handleMenuClick(menuId) {
  menuArray.forEach(function (menuItem) {
    if (menuItem.id === menuId) {
      getOrderHtml(menuItem);
    }
  });
}

function handleRemoveClick(removedObjId) {
  let removedObj = ordersArray.filter(function (order) {
    return order.id === removedObjId;
  })[0];
  const index = ordersArray.indexOf(removedObj);
  ordersArray.splice(index, 1);
  getOrderHtml();
}

function getOrderHtml(menuItem) {
  if (menuItem) {
    ordersArray.push(JSON.parse(JSON.stringify(menuItem)));
  }
  let orderHtml = "";
  let priceArray = [0];

  ordersArray.forEach(function (order) {
    order.id = uuidv4();
    orderHtml += `<div class="order-info-details">
                  <h3>${order.name}<span class="remove-item" data-remove="${order.id}">remove</span></h3>
                  <p class="price">$${order.price}</p>
                </div>`;
    priceArray.push(order.price);
  });
  orderRender(orderHtml, priceArray);
}

function orderRender(orderHtml, priceArray) {
  const totalPrice = getTotalPrice(priceArray);
  document.querySelector(".order").innerHTML = `
  <div class="container">
          <div class="order-info">
            <h2>Your order</h2>
            ${orderHtml}
            <div class="order-info-details total">
              <h3>Total Price:</h3>
              <p class="price">$${totalPrice}</p>
            </div>
            <button class="order-btn">Complete order</button>
          </div>
        </div>`;
}

function getTotalPrice(priceArray) {
  const totalPrice = priceArray.reduce(function (total, num) {
    return total + num;
  });
  return totalPrice;
}

function showPaymentModal() {
  const modal = document.querySelector(".modal");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  const modalForm = document.querySelector("form");
  modal.style.display = "block";

  modalCloseBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const modalformData = new FormData(modalForm);
    const nameOnCard = modalformData.get("nameoncard");
    modal.style.display = "none";
    document.querySelector(".order").style.display = "none";
    document.querySelector(".success-message").style.display = "block";
    document.getElementById("name").innerHTML = nameOnCard;
  });
}

function getMenuHtml() {
  let menuHtml = "";
  menuArray.forEach(function (menuItem) {
    menuItem.id = uuidv4();
    menuHtml += `
		<div class="menu-item">
            <p class="menu-emoji">${menuItem.emoji}</p>
            <div class="menu-item-descr">
              <h3>${menuItem.name}</h3>
              <p class="menu-item-descr-details">${menuItem.ingredients.join(
                ", "
              )}</p>
              <p class="price">$${menuItem.price}</p>
            </div>
            <button class="menu-btn" data-menu="${menuItem.id}"></button>
          </div>
	`;
  });
  return menuHtml;
}

function menuRender() {
  document.getElementById("menu").innerHTML = getMenuHtml();
}

menuRender();
