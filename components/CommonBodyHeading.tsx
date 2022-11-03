import React from "react";

type Props = {
  heading: string;
  subheading: string;
  description: string;
};

function CommonBodyHeading({ heading, subheading, description }: Props) {
  return (
    <div>
      <h1 className="text-4xl font-bold">{heading}</h1>
      <h2 className="text-xl font-semibold pt-5">{subheading}</h2>
      <p className="pb-5">{description}</p>
    </div>
  );
}

export default CommonBodyHeading;
