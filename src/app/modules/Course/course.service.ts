import mongoose from 'mongoose';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';
import { SortOrder } from 'mongoose';
import { ReviewModel } from '../review/review.model';
const createCourseIntoDB = async (course: TCourse) => {
  const result = (await CourseModel.create(course)).populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');
  return result;
};

const getAllCoursesFromDB = async (payload: any) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder = 'asc',
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = payload;

  const skip = (page - 1) * limit;

  let query: any = {};
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
    if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
  }

  if (tags) {
    query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  }
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }
  if (language) {
    query.language = language;
  }
  if (provider) {
    query.provider = provider;
  }
  if (durationInWeeks) {
    query.durationInWeeks = durationInWeeks;
  }
  if (level) {
    query['details.level'] = level;
  }
  const sortOptions: { [key: string]: SortOrder } = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder as SortOrder;
  }

  const result = await CourseModel.find(query)
  .sort(sortOptions)
  .skip(skip)
  .limit(limit)
  .populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');

  return result;
};

const updateACourseIntoDB = async (
  courseId: string,
  payload: Partial<TCourse>,
) => {
  const { tags, details, ...remainingCourseData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingCourseData,
  };

  if (tags && Object.keys(tags).length) {
    for (const [key, value] of Object.entries(tags))
      modifiedUpdatedData[`tags.${key}`] = value;
  }

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details))
      modifiedUpdatedData[`details.${key}`] = value;
  }

  const result = await CourseModel.findByIdAndUpdate(
    courseId,
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  ).populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');
  return result;
};

const getCourseWithReviewFromDB = async (courseId: string) => {
  const result = await CourseModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
  ]);

  if (result.length === 0) {
    return null;
  }

  const course = await CourseModel.findById(result[0]._id).populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');

  const reviews = await Promise.all(result[0].reviews.map(async (reviewId : any) => {
    const review = await ReviewModel.findById(reviewId).populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');
    return review;
  }));

  const formattedData = {
    course,
    reviews: reviews || [],
  };

  return formattedData;
};

const getCourseWithReviewAndRatingFromDB = async () => {
  const result = await CourseModel.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $unwind: "$reviews"
    },
    {
      $group: {
        _id: '$_id',
        courseData: { $first: '$$ROOT' },
        averageRating: { $avg: '$reviews.rating' },
        maxAverageRating: { $max: { $avg: '$reviews.rating' } },
        maxAverageRatingCount: { $sum: 1 }
      }
    },
    {
      $sort: { maxAverageRating: -1 }
    },
    {
      $limit: 1
    },
    {
      $set: {
        maxAverageRating: "$maxAverageRating",
        maxAverageRatingCount: "$maxAverageRatingCount"
      }
    },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: ['$courseData', { maxAverageRating: "$maxAverageRating", maxAverageRatingCount: "$maxAverageRatingCount" }] }
      }
    },
    {
      $project: {
        'reviews': 0
      }
    }
  ]);

  return result[0];
}


export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updateACourseIntoDB,
  getCourseWithReviewFromDB,
  getCourseWithReviewAndRatingFromDB
};
