# [leetcode]1.两数之和

## 题目

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

你可以按任意顺序返回答案。 

示例 1：

> 输入：nums = [2,7,11,15], target = 9
> 输出：[0,1]
> 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

示例 2：

> 输入：nums = [3,2,4], target = 6
> 输出：[1,2]

示例 3：

> 输入：nums = [3,3], target = 6
> 输出：[0,1]


提示：

> 2 <= nums.length <= 103
> -109 <= nums[i] <= 109
> -109 <= target <= 109
> 只会存在一个有效答案

## 解题思路

### 我的思路

暴力枚举：找到两数之和，大致的思路是，依次遍历整个数组。取第n个数nums[n]，然后依此取n+1个数（因为n之前的数已经做过加法的，所以不必考虑，只考虑n之后的就行了），判断nums[n]+nums[n+1]等于target，直到n=length时停止。

### 我的代码

```go
func twoSum(nums []int, target int) []int {
	n :=len(nums)
	ans := make([]int, 2)
	for i:=0;i<n;i++{
		for j:=i+1;j<n;j++{
			if nums[i]+nums[j]==target {
				//fmt.Println("i=,j=",i,j)
				ans[0]=i
				ans[1]=j
			}
		}
	}
	return ans
}
```

#### 复杂度分析

时间复杂度：O(N^2)，其中 N 是数组中的元素数量。最坏情况下数组中任意两个数都要被匹配一次。

空间复杂度：O(1)。

### 自我评价

好多年不碰算法的第一题，硬是写了几个小时，菜鸡哭泣。由于不会写返回，强行定义了一个切片来存储。越看越蠢。

直接在if里`return []int{i, j}`就好啦。

> 加油少年！

### 补充思路

#### 哈希表（来自leetcode官方）

注意到方法一的时间复杂度较高的原因是寻找 target - x 的时间复杂度过高。因此，我们需要一种更优秀的方法，能够快速寻找数组中是否存在目标元素。如果存在，我们需要找出它的索引。

使用哈希表，可以将寻找 target - x 的时间复杂度降低到从 O(N)降低到O(1)。

这样我们创建一个哈希表，对于每一个 x，我们首先查询哈希表中是否存在 target - x，然后将 x 插入到哈希表中，即可保证不会让 x 和自己匹配。

```go
func twoSum(nums []int, target int) []int {
    hashTable := map[int]int{}
    for i, x := range nums {
        if p, ok := hashTable[target-x]; ok {
            return []int{p, i}
        }
        hashTable[x] = i
    }
    return nil
}
```

