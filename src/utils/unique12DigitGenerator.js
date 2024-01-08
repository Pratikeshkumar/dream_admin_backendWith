let counter = 0;
let lastTimestamp = 0;

function generateUniqueNumber() {
  const timestamp = Date.now();
  if (timestamp === lastTimestamp) {
    counter = (counter + 1) % 1000; // Keep the counter under 1000
  } else {
    counter = 0;
    lastTimestamp = timestamp;
  }

  const timestampString = timestamp.toString().substr(-9); // Last 9 digits of the timestamp
  const counterString = counter.toString().padStart(3, '0'); // Counter as a 3-digit string

  return Number(timestampString + counterString);
}

module.exports = generateUniqueNumber;