const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const uploadsDir = path.join(__dirname, '../../uploads/hbd')

function addDay(date = new Date(), days = 1) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

function fileRemover() {
    fs.readdir(uploadsDir, function (err, files) {
        files.forEach(function (file, index) {
            fs.stat(path.join(uploadsDir, file), function (err, stat) {
                var endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = addDay();
                if (now > endTime) {
                    return rimraf(path.join(uploadsDir, file), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('successfully deleted');
                    });
                }
            });
        });
    });
}

// setInterval(fileRemover, 1800000)

module.exports = { addDay }
