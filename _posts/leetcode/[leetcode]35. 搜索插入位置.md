# [leetcode]35. 搜索插入位置

## 题目

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。

示例 1:

> 输入: nums = [1,3,5,6], target = 5
> 输出: 2

示例 2:

> 输入: nums = [1,3,5,6], target = 2
> 输出: 1

示例 3:

> 输入: nums = [1,3,5,6], target = 7
> 输出: 4


提示:

- 1 <= nums.length <= 104
- -104 <= nums[i] <= 104
- nums 为 无重复元素 的 升序 排列数组
- -104 <= target <= 104

## 解题思路

首先将数组分成两部分：数组内和数组外。首先对于数组外进行异常判断，然后遍历数组内寻找target。

- 数组外

  - 数组左边：target<nums[0];返回下标0

  - 数组右边：target>nums[0];返回下标n

- 数组内

  - 数组中存在target：target==nums[i];返回下标i
  - 数组中不存在target：找到大于target的首个元素，target<nums[i];返回下标i

## 我的代码

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
     //遍历nums，查找target
        int i =0;
        //target在nums外
        if (target>nums[nums.length-1] ){
            return nums.length;
        }
        if (target<nums[0]){
            return 0;
        }
        while (i<nums.length){
            //找到target
            if (target==nums[i]){
                return i;
            }
            //target在数组内
            if (target<nums[i]){
                return i;
            }
            i++;
        }
        return 0;
    }
}
```

## 补充思路（力扣官方）

二分法。由于要求时间复杂度为 O(log n) ，故不能使用暴力算法。

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
     //二分法
        int left =0;
        int right = nums.length-1;
        while (left<=right){
            int mid = (left+right)/2;
            if (nums[mid]==target){
                return mid;
            }
            if (nums[mid]>target){
                right=mid-1;
            }
            if (nums[mid]<target){
                left=mid+1;
            }
        }
        return left;
    }
}
```

## 自我评价

审题不仔细，忽略了时间复杂度的要求，对于二分还是不够熟悉，后面应加深对二分的理解。

