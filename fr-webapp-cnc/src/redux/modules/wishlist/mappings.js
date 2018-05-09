import { splitWishlistSku, generateWishlistSku } from 'utils/wishlistUtils';

export function mapStateToLocal(items, category) {
  return items.map((item) => {
    const { updateTime, id } = item;
    let mappedItem = { update: updateTime };

    if (category === 'products') {
      const { onlineId, colorCode, sizeCode } = splitWishlistSku(id);

      mappedItem = {
        ...mappedItem,
        id: generateWishlistSku(onlineId, colorCode),
        data: {
          l1_goods_cd: onlineId,
          color_cd: colorCode,
          size_cd: sizeCode || '',
        },
      };
    } else if (category === 'styles') {
      mappedItem = { ...mappedItem, id, data: { style_id: id } };
    }

    return mappedItem;
  });
}

export function mapLocalToState(items, category) {
  return items.map((item) => {
    let id = '';

    if (category === 'products') {
      const { l1_goods_cd: onlineId, color_cd: colorCode } = item.data;

      id = generateWishlistSku(onlineId, colorCode);
    } else if (category === 'styles') {
      const { style_id: styleId } = item.data;

      id = styleId;
    }

    return { id, updateTime: item.update };
  });
}

export function mapApiToState(result = {}) {
  const { sorted_ids: sortedIds = [] } = result;

  return sortedIds.map(item => ({ id: item.Id, updateTime: Math.floor(item.Timestamp / 1000) }));
}

export function mapStateToApi(items = []) {
  return encodeURIComponent(items.map(({ id }) => id).join(','));
}
