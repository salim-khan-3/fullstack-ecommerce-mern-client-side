import React from "react";
import Banner from "./Banner/Banner";
import CategorySideNav from "./sideNav/CategorySideNav ";
import FeaturedCategories from "./FeaturedCategories/FeaturedCategories";
import PromoSection from "./PromoSection/PromoSection";
// import LeftBanner from "./LeftBanner/LeftBanner";

import NewProduct from "./NewProduct/NewProduct";
import NewsletterSection from "./NewsletterSection/NewsletterSection";
import Newsletter from "./NewsletterSection/NewsletterSection";
import FeaturedProduct from "./FeaturedProduct/FeaturedProduct";
import PromoBannerStack from "./PromoBannerStack/PromoBannerStack ";
import PopularProduct from "./PopularProduct/PopularProduct";

const Home = () => {
  return (
    <div className="">
      <div className=" container mx-auto px-4 ">
        <Banner></Banner>
      </div>
      <FeaturedCategories></FeaturedCategories>

      <section>
        <div className="container mx-auto py-10">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-10 items-start">
            {/* Left Side Banner (Mobile-e niche thakbe, Desktop-e bame) */}
            <div className="w-full lg:col-span-1">
              <PromoBannerStack></PromoBannerStack>
            </div>

            {/* Right Side Content (Mobile-e upore thakbe, Desktop-e dane) */}
            <div className="w-full lg:col-span-3">
              <div className="flex flex-col gap-10">
                <PopularProduct></PopularProduct>
                <NewProduct />
                <PromoSection></PromoSection>
              </div>
            </div>
          </div>
                <FeaturedProduct />




        </div>
      </section>

      <section>
        <Newsletter></Newsletter>
      </section>
    </div>
  );
};

export default Home;
// import React from "react";
// import Banner from "./Banner/Banner";
// import CategorySideNav from "./sideNav/CategorySideNav ";
// import FeaturedCategories from "./FeaturedCategories/FeaturedCategories";
// import PromoSection from "./PromoSection/PromoSection";
// import LeftBanner from "./LeftBanner/LeftBanner";
// import BestSeller from "./BestSeller/BestSeller";
// import NewProduct from "./NewProduct/NewProduct";
// import NewsletterSection from "./NewsletterSection/NewsletterSection";
// import Newsletter from "./NewsletterSection/NewsletterSection";

// const Home = () => {
//   return (
//     <div className="">
//       <div className="grid container mx-auto px-4 grid-cols-4">
//        <aside className="z-5 hidden lg:block">
//           <CategorySideNav />
//         </aside>
//         <div className="col-span-4 lg:col-span-3">
//           <Banner />
//         </div>
//       </div>
//       <FeaturedCategories></FeaturedCategories>

//       <section>
//         <div className="container mx-auto py-10">
//  <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-10 items-start">

//   {/* Left Side Banner (Mobile-e niche thakbe, Desktop-e bame) */}
//   <div className="w-full lg:col-span-1">
//     <LeftBanner />
//   </div>

//   {/* Right Side Content (Mobile-e upore thakbe, Desktop-e dane) */}
//   <div className="w-full lg:col-span-3">
//     <div className="flex flex-col gap-10">
//       <BestSeller />
//       <NewProduct />
//     </div>
//   </div>

// </div>
//         </div>
//       </section>

//       <PromoSection></PromoSection>

//       <section>
//         <Newsletter></Newsletter>
//       </section>
//     </div>
//   );
// };

// export default Home;
