import type { IArticleDetail, IArticlePage, IArticleQuery, IArticleSummary, ITag } from '../types';
import { extractHeadings } from '../utils/markdown';

type ArticleSeed = Omit<IArticleDetail, 'headings' | 'previousArticle' | 'nextArticle'>;

const articleSeeds: ArticleSeed[] = [
  {
    id: 1,
    title: '从一次接口重构看 Spring Boot 分层边界',
    summary:
      '记录一次把 Controller、Service、Repository 职责重新理顺的过程，以及为什么清晰边界比技巧更耐用。',
    publishedAt: '2026-05-12',
    updatedAt: '2026-05-13',
    tags: ['Java', 'Spring Boot', '工程化'],
    featured: true,
    readMinutes: 8,
    viewCount: 2840,
    content: `## 起因

这次重构并不是因为功能坏了，而是因为代码开始变得难读。Controller 里出现了查询条件拼装，Service 里混进了响应结构，Repository 也开始知道业务状态。

当一个小项目想要继续长大，最先需要清理的通常不是技术栈，而是边界。

## 分层应该解决什么

一个比较舒服的后端分层，至少要让每一层回答清楚自己的问题：

| 层级 | 主要问题 | 不该做的事 |
| --- | --- | --- |
| Controller | 请求怎么进来、响应怎么出去 | 写业务规则 |
| Service | 业务流程和事务怎么组织 | 直接拼 SQL |
| Repository | 数据如何读取和保存 | 判断业务含义 |

## 一个小例子

下面是我更喜欢的 Service 形态，它把业务动作留在业务层，把返回包装交给 Web 层。

\`\`\`java
public ArticleDetailVo getPublishedArticle(Long id) {
    Article article = articleMapper.selectById(id);
    if (article == null || article.getStatus() != ArticleStatus.PUBLISHED) {
        throw new BizException("文章不存在");
    }
    return articleAssembler.toDetailVo(article);
}
\`\`\`

## 取舍

不是每个项目一开始都需要复杂架构。真正重要的是，当代码出现重复判断、跨层依赖、接口难测这些信号时，能够及时停下来整理。

$$
clean\\ boundary > clever\\ shortcut
$$

## 小结

分层不是为了显得专业，而是为了让后续改动有地方落脚。边界清晰之后，测试、协作和重构都会轻松很多。`,
  },
  {
    id: 2,
    title: 'AI Agent 写代码时，我真正想让它接管什么',
    summary: '把 Agent 当成协作者，而不是自动补全：它适合承担探索、验证和重复劳动。',
    publishedAt: '2026-05-08',
    updatedAt: '2026-05-09',
    tags: ['AI Agent', '思考'],
    featured: false,
    readMinutes: 6,
    viewCount: 1960,
    content: `## 协作而不是代替

我不希望 Agent 替我做所有判断。更理想的状态是：我负责目标、约束和验收，它负责把上下文铺开、把重复劳动做干净。

## 它适合做的事

- 搜索项目里的既有模式
- 生成重复但容易出错的样板代码
- 跑构建、读错误、收敛失败原因
- 把实现过程整理成可复查的清单

## 它不该接管的事

产品取舍、用户体验、长期架构边界，这些仍然需要人来判断。Agent 可以提出选项，但最终要有人承担选择。

## 一个工作流

\`\`\`ts
type AgentTask = {
  goal: string;
  constraints: string[];
  verification: string[];
};
\`\`\`

## 小结

好的 Agent 协作不是让人消失，而是让人把注意力放回真正重要的地方。`,
  },
  {
    id: 3,
    title: 'MyBatis-Plus 的方便与边界',
    summary: '快速 CRUD 很香，但复杂查询、领域约束和事务边界仍然需要开发者自己守住。',
    publishedAt: '2026-04-29',
    updatedAt: '2026-04-30',
    tags: ['MyBatis-Plus', '数据库'],
    featured: false,
    readMinutes: 7,
    viewCount: 1730,
    content: `## 快速不是问题

MyBatis-Plus 最大的价值是减少重复 CRUD，让开发者尽快进入业务本身。这一点在中后台项目里非常实用。

## 边界在哪里

当查询开始跨多个聚合、条件开始动态组合、事务规则开始复杂时，就不能只依赖便捷 API 了。

## 我的使用原则

1. 简单单表查询交给 Wrapper。
2. 复杂查询写清楚 SQL。
3. Service 层负责事务和业务语义。

## 示例

\`\`\`java
LambdaQueryWrapper<Article> wrapper = Wrappers.lambdaQuery(Article.class)
    .eq(Article::getStatus, ArticleStatus.PUBLISHED)
    .orderByDesc(Article::getCreatedAt);
\`\`\`

## 小结

工具的方便应该服务于清晰，而不是替代清晰。`,
  },
  {
    id: 4,
    title: '给个人博客设计一个不过度设计的后台',
    summary: '后台界面应该安静、直接、耐用，把写作路径做短，而不是把功能堆满。',
    publishedAt: '2026-04-21',
    updatedAt: '2026-04-22',
    tags: ['产品设计', '后台'],
    featured: false,
    readMinutes: 5,
    viewCount: 1288,
    content: `## 后台不是展厅

个人博客后台最重要的是让写作顺畅，而不是展示设计能力。标题、标签、正文、发布状态，这些路径要短。

## 功能优先级

| 优先级 | 功能 |
| --- | --- |
| P0 | 写文章、编辑文章、删除文章 |
| P1 | 草稿、标签管理 |
| P2 | 统计、站点配置 |

## 设计原则

后台应该更像工具台：信息密度高、反馈明确、不要过多装饰。

## 小结

能减少一次犹豫的后台，就是好后台。`,
  },
  {
    id: 5,
    title: 'Redis 缓存文章热榜的三个小坑',
    summary: '缓存键设计、过期策略和计数一致性，是小项目里也值得认真处理的问题。',
    publishedAt: '2026-04-12',
    updatedAt: '2026-04-13',
    tags: ['Redis', '性能'],
    featured: false,
    readMinutes: 6,
    viewCount: 1420,
    content: `## 坑一：缓存键太随意

缓存键需要稳定、可读、可批量管理。比如文章热榜可以使用 \`blog:article:hot:list\`。

## 坑二：过期策略没有节奏

热门内容不一定要实时刷新。很多个人博客场景里，分钟级缓存已经足够。

## 坑三：计数一致性

阅读量可以先写 Redis，再异步合并到 MySQL。关键是要能接受短时间内的最终一致。

## 小结

缓存不是万能加速器，它是一份关于新鲜度和一致性的取舍。`,
  },
  {
    id: 6,
    title: '一次 Java 参数校验的整理',
    summary: '用 jakarta.validation 把入口校验统一起来，让 Controller 少一点杂音。',
    publishedAt: '2026-03-28',
    updatedAt: '2026-03-28',
    tags: ['Java', 'Spring Boot'],
    featured: false,
    readMinutes: 4,
    viewCount: 980,
    content: `## 为什么整理参数校验

参数校验散落在业务代码里，会让异常路径越来越难读。入口处统一校验，是更稳的选择。

## 常见写法

\`\`\`java
public Result<Void> create(@Valid @RequestBody ArticleCreateReq req) {
    articleService.create(req);
    return Result.success();
}
\`\`\`

## 小结

校验越靠近入口，业务代码越清爽。`,
  },
  {
    id: 7,
    title: '我为什么喜欢小步提交',
    summary: '小步提交不是仪式感，而是给回滚、复盘和 Review 留下清晰路径。',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    tags: ['工程化', 'Git'],
    featured: false,
    readMinutes: 4,
    viewCount: 760,
    content: `## 提交是思考痕迹

一个好的提交应该能说明：为什么改、改了什么、怎么验证。

## 小步的好处

- Review 更轻
- 回滚更准
- 复盘更容易

## 小结

写代码时留白，提交历史里也应该留白。`,
  },
  {
    id: 8,
    title: '从 README 开始整理一个项目',
    summary: 'README 不是门面，它是项目交给陌生人的第一条路径。',
    publishedAt: '2026-03-02',
    updatedAt: '2026-03-03',
    tags: ['工程化', '文档'],
    featured: false,
    readMinutes: 5,
    viewCount: 880,
    content: `## README 的作用

README 应该告诉后来者：这个项目是什么、怎么启动、当前阶段做到哪里。

## 必须有的内容

1. 项目定位
2. 技术栈
3. 本地启动
4. 当前范围

## 小结

好的文档不是写给机器的，是写给下一位需要接手的人。`,
  },
];

export const articles: IArticleDetail[] = articleSeeds.map((article) => ({
  ...article,
  headings: extractHeadings(article.content),
}));

export const articleSummaries: IArticleSummary[] = articles.map(
  ({ content: _content, updatedAt: _updatedAt, headings: _headings, ...summary }) => summary,
);

export const featuredArticle = articleSummaries.find((article) => article.featured) ?? articleSummaries[0];

export function getAllTags(): ITag[] {
  const counts = articleSummaries.reduce<Record<string, number>>((acc, article) => {
    article.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });

    return acc;
  }, {});

  return Object.entries(counts).map(([name, count], index) => ({
    id: index + 1,
    name,
    color: index % 2 === 0 ? '#EAF3DE' : '#FAECE7',
    count,
  }));
}

export function getArticlePage({
  page = 1,
  pageSize = 5,
  tag,
  keyword,
}: IArticleQuery): IArticlePage {
  const normalizedKeyword = keyword?.trim().toLowerCase();
  const filtered = articles
    .filter((article) => (tag ? article.tags.includes(tag) : true))
    .filter((article) => {
      if (!normalizedKeyword) {
        return true;
      }

      return [article.title, article.summary, article.content, article.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword);
    });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    records: filtered.slice(start, start + pageSize).map(
      ({ content: _content, updatedAt: _updatedAt, headings: _headings, ...summary }) => summary,
    ),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export function getArticleById(id: number): IArticleDetail | undefined {
  const index = articles.findIndex((article) => article.id === id);

  if (index < 0) {
    return undefined;
  }

  const article = articles[index];
  const previousArticle = articles[index + 1];
  const nextArticle = articles[index - 1];

  return {
    ...article,
    previousArticle: previousArticle
      ? articleSummaries.find((summary) => summary.id === previousArticle.id)
      : undefined,
    nextArticle: nextArticle ? articleSummaries.find((summary) => summary.id === nextArticle.id) : undefined,
  };
}

export const homeStats = {
  articleCount: articleSummaries.length,
  tagCount: getAllTags().length,
  viewCount: articleSummaries.reduce((sum, article) => sum + (article.viewCount ?? 0), 0),
};
