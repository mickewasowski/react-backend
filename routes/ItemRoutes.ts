import express from 'express';
import { getAllItems, updateItem, postItem, deleteItem, getAllItemsCount, searchItem, getAllItemsPerOwner, getLatestThreeAdded } from '../controllers/ItemController';

const router = express.Router();

router.route("/").get(getAllItems).post(postItem).patch(updateItem).delete(deleteItem);
router.route("/count").get(getAllItemsCount);
router.route("/search").get(searchItem);
router.route("/owned").get(getAllItemsPerOwner);
router.route("/latest").get(getLatestThreeAdded);

export default router;