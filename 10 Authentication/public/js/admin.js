const deleteProduct = (btn) => {
  //access to the surrounding nodes
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  //Get the closest parent article of the button
  const productElement = btn.closest("article");

  //fetch is not only for fetching data but sending data too
  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      console.log(data);
      //Supported for all the browsers
      productElement.parentNode.removeChild(productElement);
      //productElement.remove(); not supported in Internet Explorer
    })
    .catch((err) => {
      console.log(err);
    });
};
