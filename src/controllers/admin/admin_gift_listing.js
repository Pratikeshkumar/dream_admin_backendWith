const { GiftListing } = require('../../models')
const logger = require("../../utils/logger");
const multer = require("multer");
const { s3 } = require('../../config/aws')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


const getGifts_listing = async (req, res) => {
  try {
    const gifts_listing = await GiftListing.findAll();

    res.status(200).json({
      message: "GiftsListing retrieved successfully",
      data: gifts_listing,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while processing your request", error });
  }
};



// Controller function to add a gift listing
// const addGifts_listing = async (req, res) => {
//   logger.info("INFO -> ADDING GIFT LISTING API CALLED");
//   try {
//     upload.fields([{ name: 'gift_image', maxCount: 1 }])(req, res, async (err) => {
//       const giftImage = req.files['gift_image'][0];
//       const { gift_name, cost, category } = req.body;
//       console.log(req.body)
//       console.log(giftImage)
//       const imageUrl = `video_gift/${giftImage.filename}`;
//       console.log(imageUrl, "imageUrl")


//       const uploadVideo = {
//         Bucket: 'dreamapplication',
//         Key: `video_gift/${giftImage?.filename}`,
//         Body: fs.createReadStream(giftImage?.path)
//       };
//       s3.upload(uploadVideo, (err, data) => {
//         if (err) {
//           logger.error('Error uploading video:', err);
//         } else {
//           logger.info('Video uploaded successfully:', data.Location);
//           fs.unlink(giftImage?.path, (unlinkErr) => {
//             if (unlinkErr) {
//               logger.error('Error deleting local video file:', unlinkErr);
//             } else {
//               logger.info('Local video file deleted:');
//             }
//           });
//         }
//       });

//       const newGiftListing = await GiftListing.create({
//         gift_image: imageUrl,
//         gift_name,
//         cost,
//         category,
//       });

//       res
//         .status(201)
//         .json({ message: "Gift listing added successfully", data: newGiftListing });
//     });
//   } catch (error) {
//     logger.error(error);
//     res
//       .status(500)
//       .json({
//         message: "Error generated while processing your request",
//         error,
//       });
//   }
// };


const addGifts_listing = async (req, res) => {
  logger.info("INFO -> ADDING GIFT LISTING API CALLED");
  try {
    upload.fields([{ name: 'gift_image', maxCount: 1 }])(req, res, async (err) => {
      const giftImage = req.files['gift_image'][0];
      const { gift_name, cost, category } = req.body;

      let giftCategoryPath;
      if (category === 'functional') {
        giftCategoryPath = 'functional_gift';
      } else if (category === 'mood') {
        giftCategoryPath = 'mood_gift';
      } else if (category === 'vipGifts') {
        giftCategoryPath = 'vip_gift';
      } else {
        giftCategoryPath = 'other_gift';
      }

      const imageUrl = `video_gift/${giftCategoryPath}/${giftImage.filename}`;

      const uploadVideo = {
        Bucket: 'dreamapplication',
        Key: imageUrl,
        Body: fs.createReadStream(giftImage.path)
      };

      const s3Upload = () => {
        return new Promise((resolve, reject) => {
          s3.upload(uploadVideo, (uploadErr, data) => {
            if (uploadErr) {
              reject(uploadErr);
            } else {
              resolve(data);
            }
          });
        });
      };

      try {
        const data = await s3Upload();

        logger.info('Video uploaded successfully:', data.Location);

        fs.unlink(giftImage.path, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local video file:', unlinkErr);
          } else {
            logger.info('Local video file deleted:');
          }
        });

        const newGiftListing = await GiftListing.create({
          gift_image: imageUrl,
          gift_name,
          cost,
          category,
        });

        res.status(201).json({ message: "Gift listing added successfully", data: newGiftListing });
      } catch (uploadError) {
        logger.error('Error uploading video:', uploadError);
        res.status(500).json({ message: "Error uploading video", error: uploadError });
      }
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error generated while processing your request", error });
  }
};





const deleteGifts_listing = async (req, res) => {
  logger.info('INFO -> DELETING GIFT_LISTING API CALLED');
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route

    // Find the hobby by ID
    const existingGifts_listing = await GiftListing.findByPk(id);

    if (!existingGifts_listing) {
      return res.status(404).json({ message: 'giftListing not found' });
    }

    // Delete the hobby from the database
    await existingGifts_listing.destroy();

    res.status(200).json({ message: 'giftListing deleted successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
}
module.exports = {
  getGifts_listing, deleteGifts_listing, addGifts_listing
};