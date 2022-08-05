import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postDirectory = path.join(process.cwd(), 'posts');

export async function getSortedPostData() {
    const res = await fetch('..');
    return res.json();
}

export function getAllPostsIds() {
    const fileNames = fs.readdirSync(postDirectory);

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // use remark to convert markdown into html string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}

export function getSortedPostsData() {
    // get file names under /posts
    const fileNames = fs.readdirSync(postDirectory)
    const allPostsData = fileNames.map((fileName) => {
        // removes the .md from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // read markdown file as string
        const fullPath = path.join(postDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // use gray matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // combine the data witht the id
        return {
            id,
            ...matterResult.data
        }
        // sort posts by date
    })
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1;
        } else {
            return 0
        }
    })
}