import { Context } from 'koa';
import * as dateFormat from 'dateformat';

import ArticleModel, {
  ArticleType,
} from '../../models/ArticleModel/ArticleModel';
import CommentModel, {
  CommentType,
} from '../../models/CommentModel/CommentModel';
import UserModel, { UserType } from '../../models/UserModel/UserModel';
import baseComponent from '../../components/baseComponent/baseComponent';

// import Id from '../../models/id';

// const clean = async () => {
//   // await AdminModel.remove()
//   await ArticleModel.remove()
//   await CommentModel.remove()
//   const ids = await Ids.findOne()
//   ids.article_id = 0
//   const IDs = await ids.save()
//   console.log(IDs)
// }
// clean()

const filterField = '-__v -_id -password';

type PromiseReturnType = [CommentType, UserType, ArticleType];

class Comment extends baseComponent {
  /**
   * 新建评论
   *
   * @memberof Comment
   */
  public create = async (ctx: Context) => {
    // TODO: 前台服务设置了cookie,字段为userId
    // 如果用户没有登录而知道了别人的userId, 就可以通过伪造cookie信息发送请求，这样有安全问题
    // 暂时先这样处理
    if (!ctx.cookies.get('userId')) {
      ctx.body = {
        code: 1,
        message: 'No Permission',
      };
      return;
    }
    const { articleId } = ctx.params;
    const { userId, content } = ctx.request.body;
    try {
      if (!Number(articleId) || !Number(userId) || !content) {
        ctx.body = {
          code: 1,
          message: '参数错误',
        };
      } else {
        const [articleComment, userInfo, articleDetail] = <PromiseReturnType>(
          await Promise.all([
            <any>CommentModel.findOne({ articleId: Number(articleId) }),
            <any>UserModel.findOne({ id: Number(userId) }, filterField),
            <any>ArticleModel.findOne({ id: Number(articleId) }),
          ])
        );
        if (!articleComment || !userInfo || !articleDetail) {
          ctx.body = {
            code: 1,
            message: '没有找到对应的数据',
          };
          return;
        }
        articleComment.count++;
        articleDetail.comment_count++;
        const comment = {
          content,
          createAt: +new Date(),
          id: articleComment.comments.length + 1,
          respUserInfo: {
            id: 0, // id=0 表示的是作者 评论开始是针对文章的作者
            blogUser: articleDetail.author,
          },
          updateAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          userId: Number(userId),
          userInfo,
        };
        articleComment.comments.push(comment);
        await Promise.all([articleComment.save(), articleDetail.save()]);
        const commentData = articleComment.comments.find((item) => {
          return item.id === articleComment.comments.length;
        })!;
        ctx.body = {
          code: 0,
          data: commentData,
        };
      }
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 1,
        message: '评论发布失败',
      };
    }
  };

  /**
   * 文章的评论列表
   *
   * @memberof Comment
   */
  public getArticleComment = async (ctx: Context) => {
    const { articleId } = ctx.params;
    const { userId } = ctx.query;
    try {
      if (!Number(articleId)) {
        throw new Error('没有找到对应文章');
      }
      const articleComment = <CommentType>(
        await CommentModel.findOne(
          { articleId: Number(articleId) },
          '-__v -_id',
        )
      );
      // TODO: 遍历了comments 来查看用户在这篇文章中喜欢了哪些评论
      // 有待优化
      if (Number(userId)) {
        for (const comment of articleComment.comments) {
          const index = comment.likedUser!.findIndex(
            (item) => item.id === Number(userId),
          );
          if (index > -1) {
            comment.isLiked = true;
          } else {
            comment.isLiked = false;
          }
        }
      }
      ctx.body = {
        code: 0,
        data: articleComment,
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 1,
        message: '获取文章评论失败',
      };
    }
  };

  /**
   * 点赞评论
   *
   * @memberof Comment
   */
  public likeComment = async (ctx: Context) => {
    if (!ctx.cookies.get('userId')) {
      ctx.body = {
        code: 1,
        message: 'No Permission',
      };
      return;
    }
    const { articleId } = ctx.params;
    const { commentId, userId } = ctx.request.body;
    try {
      if (!Number(commentId)) {
        throw new Error('没有找到对应的评论');
      }
      if (!Number(userId) && !ctx.cookies.get('userId')) {
        ctx.body = {
          code: 1,
          message: '请先登录再点赞',
        };
        return;
      }
      const [articleComment, userInfo] = <[CommentType, UserType]>(
        await Promise.all([
          <any>CommentModel.findOne({ articleId: Number(articleId) }),
          <any>UserModel.findOne({ id: Number(userId) }, filterField),
        ])
      );
      for (const comment of articleComment.comments) {
        if (comment.id === Number(commentId)) {
          const index = comment.likedUser!.findIndex(
            (item) => item.id === Number(userId),
          );
          if (index > -1) {
            comment.likedUser = comment.likedUser!.filter(
              (user) => user.id !== Number(userId),
            );
            comment.likesCount = comment.likedUser.length;
            await articleComment.save();
            ctx.body = {
              code: 0,
              isLiked: false,
              likesCount: comment.likesCount,
              message: '已取消点赞',
            };
          } else {
            comment.likedUser!.push(userInfo);
            comment.likesCount = comment.likedUser!.length;
            await articleComment.save();
            ctx.body = {
              code: 0,
              isLiked: true,
              likesCount: comment.likesCount,
              message: '点赞成功',
            };
          }
        }
      }
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 1,
        message: '点赞失败',
      };
    }
  };

  /**
   * 回复评论
   *
   * @memberof Comment
   */
  public replyComment = async (ctx: Context) => {
    if (!ctx.cookies.get('userId')) {
      ctx.body = {
        code: 1,
        message: 'No Permission',
      };
      return;
    }
    const articleId = Number(ctx.params.articleId);
    const commentId = Number(ctx.params.commentId);
    const userId = Number(ctx.params.userId);
    const respUserId = Number(ctx.params.respUserId);
    const { content, isReply = false } = ctx.request.body;
    try {
      if (!articleId || !userId || !respUserId || !content) {
        ctx.body = {
          code: 1,
          message: '参数错误',
        };
      } else {
        const [articleComment, userInfo, respUserInfo, articleDetail] = <
          [CommentType, UserType, UserType, ArticleType]
        >await Promise.all([
          <any>CommentModel.findOne({ articleId }),
          <any>UserModel.findOne({ id: userId }, filterField),
          <any>UserModel.findOne({ id: respUserId }, filterField),
          <any>ArticleModel.findOne({ id: articleId }),
        ]);
        // 评论的评论或者回复
        for (const comment of articleComment.comments) {
          if (comment.id === commentId) {
            comment.subComments!.push({
              content,
              createAt: +new Date(),
              id: comment.subComments!.length + 1,
              respComment: isReply ? true : false,
              respUserId: respUserInfo.id,
              respUserInfo,
              updateAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
              userId: Number(userId),
              userInfo,
            });
            comment.subCount = comment.subComments!.length;
          }
        }
        articleComment.count++;
        articleDetail.comment_count++;
        const [comments] = await Promise.all([
          articleComment.save(),
          articleDetail.save(),
        ]);
        const selectComment = comments.comments.find(
          (item) => item.id === commentId,
        );
        ctx.body = {
          code: 0,
          data: selectComment!.subComments,
        };
      }
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 1,
        message: '评论回复失败',
      };
    }
  };
}

export default new Comment();
