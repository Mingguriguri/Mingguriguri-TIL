// .github/scripts/sync.js
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

async function syncNotionToGithub() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Status',
      select: {
        equals: '완료'
      }
    }
  });

  for (const page of response.results) {
    // 완료된 페이지의 내용을 마크다운으로 변환
    const content = await getPageContent(page.id);
    // GitHub에 파일 생성/업데이트
    await commitToGithub(content);
  }
}

syncNotionToGithub();
