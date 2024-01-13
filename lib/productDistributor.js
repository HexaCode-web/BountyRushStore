export default function productDistributor(
  productList = [],
  CategoryContainer = []
) {
  CategoryContainer.forEach((category) => {
    category.products = [];
  });
  productList.forEach((product) => {
    CategoryContainer.forEach((Container) => {
      if (product.category === Container.Name) {
        if (Container.products.length === 0) {
          Container.products.push(product);
        } else {
          if (
            Container.products.find(
              (innerProduct) => innerProduct.id == product.id
            )
          ) {
            return;
          } else {
            Container.products.push(product);
          }
        }
      }
    });
  });
  for (let index = 0; index < CategoryContainer.length; index++) {
    setTimeout(() => {
      SETDOC("categories", CategoryContainer[index].id, {
        ...CategoryContainer[index],
      });
    }, 500);
  }
}
