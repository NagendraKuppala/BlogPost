import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class dbService {
  client = new Client();
  database;
  storage;

  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectID);

    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userID }) {
    try {
      /** AppWrite Create a new Document
       * const promise = databases.createDocument('[DATABASE_ID]', '[COLLECTION_ID]', '[DOCUMENT_ID]', {}); */
      return await this.database.createDocument(
        config.appWriteDatabaseID,
        config.appWriteCollectionID,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userID,
        }
      );
    } catch (error) {
      console.log("CreatePost :: Error :: ", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.database.updateDocument(
        config.appWriteDatabaseID,
        config.appWriteCollectionID,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("UpdatePost :: Error :: ", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      return await this.database.deleteDocument(
        config.appWriteDatabaseID,
        config.appWriteCollectionID,
        slug
      );
    } catch (error) {
      console.log("DeletePost :: Error :: ", error);
      throw error;
    }
  }

  async getPost(slug) {
    try {
      const post = await this.database.getDocument(
        config.appWriteDatabaseID,
        config.appWriteCollectionID,
        slug
      );
      if (!post) {
        throw new Error("No Post Found");
      }
      return post;
    } catch (error) {
      console.log("GetPost :: Error :: ", error);
      throw error;
    }
  }

  async getPosts(query = [Query.equal("status", "active")]) {
    try {
      return await this.database.listDocuments(
        config.appWriteDatabaseID,
        config.appWriteCollectionID,
        query
      );
    } catch (error) {
      console.log("getPosts :: Error :: ", error);
      throw error;
    }
  }

  async getPostsByUser(userID) {
    try {
      return await this.database.listDocuments(
        config.appWriteDatabaseID,
        config.appWriteCollectionID,
        [Query.equal("userPosts", userID)]
      );
    } catch (error) {
      console.log("getPosts :: Error :: ", error);
      throw error;
    }
  }

  // File(featuredImage) Upload/Delete services
  async uploadFeaturedImage(file) {
    try {
      return await this.storage.createFile(
        config.appWriteBucketID,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("uploadFeaturedImage :: Error :: ", error);
      throw error;
    }
  }

  getImagePreview(fileID) {
    try {
      return this.storage.getFilePreview(config.appWriteBucketID, fileID);
    } catch (error) {
      console.log("getImagePreview :: Error :: ", error);
      throw error;
    }
  }

  async deleteFeaturedImage(fileID) {
    try {
      return await this.storage.deleteFile(config.appWriteBucketID, fileID);
    } catch (error) {
      console.log("getImagePreview :: Error :: ", error);
      throw error;
    }
  }
}

const dbservice = new dbService();

export default dbservice;
