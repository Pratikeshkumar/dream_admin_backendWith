const { User } = require('../../models')
const logger = require('../../utils/logger')
const uuid = require('uuid');
const fs = require('fs');
const { s3 } = require('../../config/aws')
const { Op } = require('sequelize');
const { admin } = require('../../../firebaseAdmin');


// admin.messaging().send({...});





const getNotification = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'profile_pic', "account_type"] // Selecting specific fields
    });

    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error while processing your request', error });
  }
};

const sendNotification = async (req, res) => {
  logger.info('INFO -> SENDING NOTIFICATION API CALLED')
  try {
    const {
      title, // html with one tag and style
      subtitle, // html with one tag and style
      body, // html with one tag and style
      color, // color value
      importance, // HIGH, DEFAULT, LOW, MIN, NONE,
      sound_enabled, // boolean,
      vibration_enabled, // boolean
      id // array
    } = req.body;
    console.log(req.body, "boodudhjdj")

    const channelId = uuid.v4()
    let largeIcon = req?.files['large_icon'][0]?.originalname;
    console.log(largeIcon)
    let large_icon_path = req?.files['large_icon'][0]?.path
    let bigPicture = req?.files['big_picture'][0]?.originalname;
    let big_picture_path = req?.files['big_picture'][0]?.path

    if (largeIcon) {
      const uploadLargeIocn = {
        Bucket: 'dreamapplication',
        Key: `notification/${largeIcon}`,
        Body: fs.createReadStream(large_icon_path)
      };
      s3.upload(uploadLargeIocn, (err, data) => {
        if (err) {
          logger.error('Error uploading video:', err);
        } else {
          logger.info('Video uploaded successfully:', data.Location);
          fs.unlink(large_icon_path, (unlinkErr) => {
            if (unlinkErr) {
              logger.error('Error deleting local video file:', unlinkErr);
            } else {
              logger.info('Local video file deleted:', large_icon_path);
            }
          });
        }
      });
    }


    if (bigPicture) {
      console.log(bigPicture)
      const uploadBigPicture = {
        Bucket: 'dreamapplication',
        Key: `notification/${bigPicture}`,
        Body: fs.createReadStream(big_picture_path)
      };
      s3.upload(uploadBigPicture, (err, data) => {
        if (err) {
          logger.error('Error uploading video:', err);
        } else {
          logger.info('Video uploaded successfully:', data.Location);
          fs.unlink(big_picture_path, (unlinkErr) => {
            if (unlinkErr) {
              logger.error('Error deleting local video file:', unlinkErr);
            } else {
              logger.info('Local video file deleted:', big_picture_path);
            }
          });
        }
      });
    }


    const large_icon = `https://dpcst9y3un003.cloudfront.net/notification/${largeIcon}`
    const big_picture = `https://dpcst9y3un003.cloudfront.net/notification/${bigPicture}`



    let result = await User.findAll({
      where: {
        id: {
          [Op.in]: id,
        },
      },
      attributes: ['device_token'],
    });
    const deviceTokens = []
    JSON.parse(JSON.stringify(result)).forEach(element => {

      element?.device_token ? deviceTokens.push(element.device_token) : ''
    });
    console.log(deviceTokens, "deviceTokens")

    // await notifee.createChannel({
    //   id: channelId?.id,
    //   name: channelId?.id,
    //   badge: true,
    //   importance: AndroidImportance.channelId?.importance,
    //   sound: channelId?.sound,
    //   vibration: channelId?.vibration,
    //   vibrationPattern: channelId?.vibrationPattern,
    // })

    // await notifee.displayNotification({
    //   title: notifee_data?.title,
    //   subtitle: notifee_data?.subtitle,
    //   body: notifee_data?.body,
    //   android: {
    //     channelId: notifee_data?.android?.channelId,
    //     largeIcon: notifee_data?.android?.largeIcon,
    //     importance: AndroidImportance?.android?.importance,
    //     color: notifee_data?.android?.color ? notifee_data?.android?.color : '#020202',
    //     sound: notifee_data?.android?.sound ? 'sound' : null,
    //     vibrationPattern: [300, 500],
    //     style: {
    //       type: AndroidStyle?.notifee_data?.android?.style?.type,
    //       picture: AndroidStyle?.notifee_data?.android?.style?.picture
    //     },
    //   }

    // });






    await admin.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      data: {
        notifee: JSON.stringify({
          title: title,
          subtitle: subtitle,
          body: body,
          android: {
            channelId: channelId,
            largeIcon: large_icon,
            importance: importance,
            color: color ? color : '#020202',
            sound: sound_enabled ? 'sound' : null,
            vibrationPattern: [300, 500],
            style: {
              type: `BIGPICTURE`,
              picture: big_picture
            },
          }



        }),
        channelId: JSON.stringify(
          {
            id: channelId,
            name: channelId,
            badge: true,
            importance: `AndroidImportance.${importance}`,
            sound: sound_enabled ? 'sound' : null,
            vibration: true,
            vibrationPattern: [300, 500],
          }
        )
      }

    })

    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'Notification sended successfully'
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}










module.exports = {
  getNotification, sendNotification
}