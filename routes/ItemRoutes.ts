import express from 'express';
import { getAllItems, updateItem, postItem, deleteItem, getAllItemsCount, searchItem, getAllItemsCountPerOwner, getLatestThreeAdded, getItemsPerOwner } from '../controllers/ItemController';

const router = express.Router();

router.route("/").get(getAllItems).post(postItem).patch(updateItem).delete(deleteItem);
router.route("/count").get(getAllItemsCount);
router.route("/search").get(searchItem);
router.route("/ownedCount").get(getAllItemsCountPerOwner);
router.route("/owned").get(getItemsPerOwner);
router.route("/latest").get(getLatestThreeAdded);

export default router;