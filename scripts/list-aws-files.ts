import * as AWS from "aws-sdk";
// @ts-ignore
import config from "./aws-credentials.json";
import {ISong} from "../src/types/song-types";
import * as fs from "fs";

const outFileName = "src/data/songs-list.json";

AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

const s3 = new AWS.S3({apiVersion: "2006-03-01"});

const baseUrl = config.bucketBaseUrl;

s3.listObjects({Bucket: config.bucket}, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    if (data.IsTruncated) {
      throw new Error("truncated");
    }
    // console.log("Success", data);
    const songs = data.Contents!
      .filter(value => value.Key!.trim().toUpperCase().endsWith(".MP3"))
      .map((content, index) => {
        let name = content.Key!.split("/")[content.Key!.split("/").length - 1] || "";
        name = name.slice(0, name.length - ".mp3".length);
        const song: ISong = {
          name,
          number: index + 1,
          tags: content.Key!.split("/").slice(0, content.Key!.split("/").length - 1),
          token: content.Key!,
          url: `${baseUrl}${content.Key}`,
        }
        return song;
      });
    console.log(songs);

    fs.writeFileSync(outFileName, JSON.stringify(songs));
    console.log(`written to file ${outFileName}`);
  }
})
