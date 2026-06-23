/*
props = {
  params: {
    slug: "iphone-16"
  }
}

props is an object containing a property called params, and that property is a Promise that resolves to an object having a string called slug.
(props: {
  params: Promise<{ slug: string }>;
})
*/

type ProductSlugProps = {
    params: Promise<{ slug: string; }>;
};



const ProductDetailsPage = async (props: ProductSlugProps) => {
    const { slug } = await props.params;
    return <div>{slug}</div>;
};

export default ProductDetailsPage;


