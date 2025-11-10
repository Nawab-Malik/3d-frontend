import React from "react";
import Navbar from "../components/navbar";
import SecondHome from "../components/secondhome";
import ReviewSection from "../components/reviewsection";
import IdeaCard from "../components/ideacard";
import Footer from "../components/footer";
import RequestSize from "../components/request3Dsize";

function ThirdPage() {
  return (
    <>
      <Navbar variant="image" />
      <SecondHome />
      <RequestSize />
      <ReviewSection />
      <IdeaCard />
      <Footer />
    </>
  );
}

export default ThirdPage;
