import React from "react";
import Navbar from "../components/navbar";
import SecondHome from "../components/secondhome";
import ReviewSection from "../components/reviewsection";
import IdeaCard from "../components/ideacard";
import Footer from "../components/footer";
import Request3DSize from "../components/request3Dsize";

function SecondPage() {
  return (
    <>
      <Navbar variant="image" />
      <SecondHome />
      <Request3DSize />
      <ReviewSection />
      <IdeaCard />
      <Footer />
    </>
  );
}

export default SecondPage;
