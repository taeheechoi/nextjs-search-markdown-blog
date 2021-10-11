const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function getPosts() {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            title: matterResult.data.title
        }
    })
    return JSON.stringify(allPostsData)

}

const fileContents = `export const posts = ${getPosts()}`

try {
    fs.readdirSync('cache')
} catch (e) {
    fs.mkdirSync('cache')
}

fs.writeFile('cache/data.js', fileContents, function (err) {
    if (err) return console.log(err)
    console.log('Posts cached')
})