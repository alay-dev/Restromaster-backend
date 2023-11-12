import { NextFunction, Request, Response } from "express";
import { createApi } from "unsplash-js";

export const getPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { keyword } = req.params;
  try {
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });

    const result = await unsplash.search.getPhotos({
      query: keyword,
      orientation: "squarish",
    });
    const photos = result.response.results.map((item) => {
      return {
        thumb: item.urls.thumb,
        img: item.urls.small,
      };
    });
    res.status(200).json({
      status: "success",
      data: photos,
      message: "Photos fetched",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};
