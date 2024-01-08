// add avatar
// get avatar
// update avatar
// edit avatar

const logger = require("../../utils/logger");
const { Avatar } = require("../../models");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/avatar_img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const addAvatar = async (req, res) => {
  logger.info("INFO -> ADDING AVATAR API CALLED");
  try {
    upload.fields([{ name: 'image', maxCount: 1 }])(req, res, async (err) => {
        const avatarimg = req.files['image'][0];
        // const { newAvatars } = req.body;

       console.log(avatarimg, "avatar")
    //    console.log(req.body, "avatar")

       

        // console.log('reviewImg', reviewImg)
  
        const imageUrl =`uploads/avatar_img/${avatarimg.filename}` ;
  
    
    console.log(imageUrl, "IMAGE");
   
    // Create a new avatar
    const newAvatar = await Avatar.create({
      avatar_url:imageUrl
    });

    res
      .status(201)
      .json({ message: "Avatar added successfully", data: newAvatar });
    })} catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({
        message: "Error generated while processing your request",
        error,
      });
  }
};

// const getAvatars = async (req, res) => {
//   logger.info("INFO -> GETTING AVATARS API CALLED");
//   try {
//     const { page = 1, perPage = 10 } = req.query;

//     // Calculate the offset based on the page and perPage values
//     const offset = (page - 1) * perPage;

//     // Retrieve avatars with pagination
//     const avatars = await Avatar.findAndCountAll({
//       limit: perPage,
//       offset,
//     });

//     res.status(200).json({
//       message: "Avatars retrieved successfully",
//       data: avatars.rows,
//       total: avatars.count,
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
const getAvatars = async (req, res) => {
  logger.info("INFO -> GETTING AVATARS API CALLED");
  try {
    // Retrieve all avatars
    const avatars = await Avatar.findAll();

    res.status(200).json({
      message: "Avatars retrieved successfully",
      data: avatars,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error,
    });
  }
};


const updateAvatar = async (req, res) => {
  logger.info("INFO -> UPDATING AVATAR API CALLED");
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route
    const { avatar_url } = req.body;

    // Find the avatar by ID
    const existingAvatar = await Avatar.findByPk(id);

    if (!existingAvatar) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    // Update the avatar URL
    existingAvatar.avatar_url = avatar_url;

    // Save the updated avatar to the database
    await existingAvatar.save();

    res
      .status(200)
      .json({ message: "Avatar updated successfully", data: existingAvatar });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({
        message: "Error generated while processing your request",
        error,
      });
  }
};

const deleteAvatar = async (req, res) => {
  logger.info("INFO -> DELETING AVATAR API CALLED");
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route

    // Find the avatar by ID
    const existingAvatar = await Avatar.findByPk(id);

    if (!existingAvatar) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    // Delete the avatar from the database
    await existingAvatar.destroy();

    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({
        message: "Error generated while processing your request",
        error,
      });
  }
};


// const addAvatarNew = async (req, res) => {
//   logger.info("INFO -> ADDING AVATAR API CALLED");
//   try {
//     upload.fields([{ name: 'image', maxCount: 1 }])(req, res, async (err) => {
//       if (err) {
//         logger.error("Error uploading avatar image:", err);
//         return res.status(500).json({ message: "Error uploading avatar image", error: err });
//       }

//       const avatarImage = req.files['image'][0];

//       // Determine the category path for the avatar image in the S3 bucket
//       const avatarCategoryPath = 'avatar_images';
      
//       // Construct the path where the image will be stored in the S3 bucket
//       const avatarKey = `${avatarCategoryPath}/${avatarImage.filename}`;

//       const uploadAvatar = {
//         Bucket: 'your-s3-bucket-name',
//         Key: avatarKey,
//         Body: fs.createReadStream(avatarImage.path),
//         ACL: 'public-read', // Set the appropriate ACL based on your requirements
//       };

//       const s3Upload = () => {
//         return new Promise((resolve, reject) => {
//           s3.upload(uploadAvatar, (uploadErr, data) => {
//             if (uploadErr) {
//               reject(uploadErr);
//             } else {
//               resolve(data);
//             }
//           });
//         });
//       };

//       try {
//         const s3Data = await s3Upload();
//         logger.info('Avatar uploaded successfully:', s3Data.Location);

//         // Delete the local file
//         fs.unlink(avatarImage.path, (unlinkErr) => {
//           if (unlinkErr) {
//             logger.error('Error deleting local avatar file:', unlinkErr);
//           } else {
//             logger.info('Local avatar file deleted:');
//           }
//         });

//         // Create a new avatar entry in the database with the S3 URL
//         const newAvatar = await Avatar.create({
//           avatar_url: s3Data.Location,
//         });

//         res.status(201).json({ message: "Avatar added successfully", data: newAvatar });
//       } catch (uploadError) {
//         logger.error('Error uploading avatar to S3:', uploadError);
//         res.status(500).json({ message: "Error uploading avatar to S3", error: uploadError });
//       }
//     });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       message: "Error generated while processing your request",
//       error,
//     });
//   }
// };








module.exports = {
  addAvatar,
  getAvatars,
  deleteAvatar,
  updateAvatar,
};
