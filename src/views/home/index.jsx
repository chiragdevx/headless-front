import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import {
  FEATURED_PRODUCTS,
  RECOMMENDED_PRODUCTS,
  SHOP,
} from "@/constants/routes";
import {
  useDocumentTitle,
  useFeaturedProducts,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import bannerImg from "@/images/banner-girl.png";
// import squareYou from "@/images/square.jpg"
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiPimHelper } from "@/helpers/api";

const Home = () => {
  const [collections, setCollections] = useState([]);

  useDocumentTitle("Salinaka | Home");
  useScrollTop();

  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended,
  } = useRecommendedProducts(6);

  useEffect(async () => {
    const { data } = await apiPimHelper("collections", "GET");
    const response = await Promise.all(
      data.map(async (c) => {
        const { data: res } = await apiPimHelper(
          `collection/${c.id}/products`,
          "GET"
        );
        return {
          ...c,
          products: res,
        };
      })
    );

    setCollections(response);
  }, []);

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              <strong>HEADLESS</strong>
              {/* &nbsp;everything with&nbsp; */}
              {/* <strong>Clarity</strong> */}
            </h1>
            {/* <p>
              Buying eyewear should leave you happy and good-looking, with money
              in your pocket. Glasses, sunglasses, and contacts—we’ve got your
              eyes covered.
            </p> */}
            <br />
            {/* <Link to={SHOP} className="button">
              Shop Now &nbsp;
              <ArrowRightOutlined />
            </Link> */}
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
            {/* <img src={squareYou} alt="" /> */}
          </div>
        </div>
        {collections.map((collection) => (
          <div className="display">
            <div className="display-header">
              <h1>{collection.title}</h1>
              <Link to={FEATURED_PRODUCTS}>See All</Link>
            </div>
            {false ? (
              <MessageDisplay
                message={errorFeatured}
                action={fetchFeaturedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={collection.products}
                skeletonCount={6}
              />
            )}
          </div>
        ))}

        <div className="display">
          <div className="display-header">
            <h1>Recommended Products</h1>
            <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
          </div>
          {errorRecommended && !isLoadingRecommended ? (
            <MessageDisplay
              message={errorRecommended}
              action={fetchRecommendedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={recommendedProducts}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
