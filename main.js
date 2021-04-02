const   {
            instaUsername, instaPass,
            sonarrUrl, sonarrPort, sonarrApi,
            background_image, blank_image, output, font_color
        } = require('./config.json'),
        Instagram = require('instagram-web-api'),
        clientInsta = new Instagram({ username: instaUsername, password: instaPass }),
        schedule = require('node-schedule'),
        fetch = require('node-fetch'),
        fs = require('fs'),
        Canvas = require('canvas'),
        { registerFont } = require('canvas');
        

        registerFont('assets/titleFont.ttf', { family: 'Creux' })
        registerFont('assets/bahnschrift.ttf', { family: 'Bahnschrift' })

let daily = schedule.scheduleJob('00 07 * * *' , async function(){  // News Daily at 7:00 AM
    
    const sonarrJson = await fetch(`http://${sonarrUrl}:${sonarrPort}/api/calendar?apikey=${sonarrApi}`, {method: 'GET'}).then(res => res.json());
    
    const   dateObj = new Date,
            month = String(dateObj.getMonth()+1).padStart(2, '0'),
            day = String(dateObj.getDate()).padStart(2, '0'),
            year = dateObj.getFullYear(),
            dateSNR = year+'-'+month+'-'+day,
            date = day+'-'+month+'-'+year;

    console.log('[Instagram Bot] '+date+' 07:00 time to post!');

    let coverY = 110, textY = 375;

    let elements = [];
    sonarrJson.forEach(e => {
        if (e.airDateUtc.startsWith(dateSNR)) {
            elements.push(e.airDateUtc)
        }
    });
    if (elements.length > 0) {
        console.log(elements.length+ 'new items today')
        const   canvas = Canvas.createCanvas(1080, 1920),
                ctx = canvas.getContext('2d'),
                background = await Canvas.loadImage(background_image);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '60px Bahnschrift';
        ctx.fillStyle = font_color;
        for (let i = 0; i < Math.min(sonarrJson.length, 4); i++) {
            let banner;
            let thumbUrl;
            if (sonarrJson[i].airDateUtc.startsWith(dateSNR)) {
                const titleRaw = sonarrJson[i].series.title
                const title = titleRaw.length > 25 ? titleRaw.substring(-titleRaw.length,25)+'...' : titleRaw
                const text = '- '+title+' S'+sonarrJson[i].seasonNumber.toString().padStart(2,'0')+'E'+sonarrJson[i].episodeNumber.toString().padStart(2,'0')
                for (let y = 0; y < (sonarrJson[i].series.images).length; y++) {
                    if (sonarrJson[i].series.images[y].coverType === 'banner') {
                        thumbUrl = sonarrJson[i].series.images[y].url
                        banner = 1
                    }
                };
                if (banner != 1)
                for (let y = 0; y < (sonarrJson[i].series.images).length; y++) {
                    if (sonarrJson[i].series.images[y].coverType === 'fanart') {
                    thumbUrl = sonarrJson[i].series.images[y].url
                    banner = 1
                    }
                };
                if (banner != 1) thumbUrl = sonarrJson[i].series.images[0].url

                const coverLoad = await Canvas.loadImage(thumbUrl);
                coverY += + 350;
                textY += 350;
                if (coverLoad.height > 300) {
                    const blank = await Canvas.loadImage(blank_image);
                    ctx.drawImage(coverLoad, 0, coverY, canvas.width, 1000);
                    ctx.drawImage(blank, 0, coverY+200, blank.width, blank.height)
                } else {
                    ctx.drawImage(coverLoad, 0, coverY, canvas.width, 200);
                }
                ctx.fillText(text, 15, textY)
                console.log(sonarrJson[i].series.title, thumbUrl, coverLoad.width, coverLoad.height, text)
            }
        }
        canvas.toBuffer()
        const out = fs.createWriteStream(__dirname + output)
        const stream = canvas.createJPEGStream()
        stream.pipe(out)
        out.on('finish', async () => {
            console.log('[Instagram Bot] story sent !')
            await clientInsta.login()
            const { media } = await clientInsta.uploadPhoto({ photo: output.substring(1), caption: '', post: 'story' }) // https://www.npmjs.com/package/instagram-web-api
            console.log(`Link is: https://www.instagram.com/stories/${config.instaUsername}/${media.id}/`)
        })
    } else {
      console.log('[Instagram bot] 0 new items today')
    }
})
