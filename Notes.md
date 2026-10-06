Notes

```cpp
Pattern Printing:
1> For Outer Loop, count no of lines
2.> For inner loop, focus on the columns and connect
    them somewhere to the rows
3.>Print the "*" inner for loop
4.>Observe Symmetry(Optional)

33333     n=3
32223
32123
32223
33333

STL:

pair<int,int> :(pair<int,pair<int><int>>)
    p.first, p.second
    pair<int,int> arr[]={{1,2},{3,4}};

vector<int> v;
(dynamic size)
    v.push_back(1);
{1} v.emplace_back(2);
(faster than push back){1, 2}

vector<pair<int, int>>
    vec;
v.push_back({1, 2});
v.emplace_back(1, 2);
(automatically assumes a pair)

    vector<int>
        v(5);           // auto filled container of size 5 with value 0
vector<int> v1(5, 100); // auto filled container of size 5 with value 100

vector<int> v2(v1); // create vector same as v1

vector<int>::iterator it = v.begin(); // pointer to beginning of vector,i.e, first element of vector

it++;
cout << *(it) << " ";

vector<int>::iterator it = v.end();    // does not point to last element but the memory location after the last element so we need to to --it first then we can access the last element
vector<int>::iterator it = v.rend();   // reverse end points to memory location before teh vector so ++it gives the first element of vector
vector<int>::iterator it = v.rbegin(); // point to the last element of vector

cout << v[0] << " " << v.at(0);
cout << v.back() << " "; // last element of vector

for (vector<int>::iterator it = v.begin(); it != v.end(); it++)
    cout << *it << " ";

// better way
for (auto it = v.begin(); it != v.end(); it++)
    cout << *it << " ";

// for-each loop
for (auto it : v)
    cout << it << " "; // it is not an iterator here it is the element itself

//{10,20,12,23}
v.erase(v.begin() + 1); // {10,12,23}
//{10,20,12,23,35}
v.erase(v.begin() + 2, v.begin() + 4); // {10,20,35} [Start,end)

// Insert function
vector<int> v(2, 100);          // {100,100}
v.insert(v.begin(), 300);       //{300,100,100}
v.insert(v.begin() + 1, 2, 10); //{300,10,10,100,100}

vector<int> copy(2, 50);                       //{10,10}
v.insert(v.begin(), copy.begin(), copy.end()); //{50,50,300,10,10,100}

//{10,20}
cout << v.size(); // 2

v.pop_back(); //{10}

// v1->{10,20} ,v2->{30,40}
v1.swap(v2); // v1->{30,40},v2->{10,20}
v.clear();   // erases te entire vector

cout << v.empty();

void explainList()
{
    list<int> ls; // same as vector but gives push_front also , in vec we had to do v.insert which took lots of time
    ls.push_back(2);
    ls.emplce_back(4);

    ls.push_front(5);
    ls.emplace_front(3);
    // rest functions similar to vector: begin,end,rend,rbegin,clear,insert,size,swap
}

void explainDeque()
{
    deque<int> dq;
    dq.push_back(1);
    dq.emplace_back(2);
    dp.emplace_front(5);
    dp.push_front(4);
    dq.pop_back();
    dq.pop_front();
    dq.back();
    dq.front();
    // rest functions same as vector
}
void explainStack()
{ // LIFO
    stack<int> st;
    st.push(1);
    st.push(2);
    st.push(3);
    st.push(3);
    st.emplace(5);
    cout << st.top();   // prints 5  ** st[2] is invalid**(since in stack only access top)
    st.pop();           // {3,3,2,1}
    cout << st.size();  // 4
    cout << st.empty(); // false
    stack<int> st1, st2;
    st1.swap(st2);
}

void explainQueue(){
    queue<int> q;
    q.push(1);
    q.push(2);
    q.emplace(4);// {1,2,4}
    q.back()+=5;
    cout<<q.back();// prints 9
    cout<<q.front();//prints 1
    q.pop();// {2,9}
    cout<<q.front();//prints 2
    //size swap empty same as stack
}

void explainPQ(){
    priority_queue<int>pq;// by deault Max heap
    //************************* IMP:(comparator in general asks "Does a comes before b?" ->so for ascending it means: is a less than b?)
    //for Priority Queue(min-heap) it means: "Does a have lower priority than b"(only exception that asks a little differently because in Heap the highest priority element is at top)
    pq.push(5);
    pq.push(2);
    pq.push(8);
    pq.emplace(10);//{10,8,5,2}
    cout<<pq.top();
    pq.pop();//{8,5,2}
    cout<<pq.top();// prints 8
    // size swap empty function same as others

    //minimum heap
    priority_queue<int, vector<int>,greater<int>> pq;
    pq.push(5);
    pq.push(2);
    pq.push(8);
    pq.emplace(10);//{2,5,8,10}
    cout<<pq.top();// prints 2


}

void explainSet(){
    set<int>st;//stores in sorted and distinct manner(in tree)
    st.insert(1);//{1}
    st.emplace(2);//{1,2}
    st.insert(2);//{1,2}
    st.insert(4);st.insert(3);//{1,2,3,4}
    //begin(),end(),rbegin(),end(),size(),empty(),Swap() are same as in vector
    auto it=st.find(3);//{1,2,3,4,5} returns an iterator that points to 3
    auto it st.find(6);//return st.end()
    st.erase(5);//erase 5 //takes logarithmic time

    int cnt=st.count(1);// 1 or 0
    auto it=st.find(3);
    st.erase(it);//it takes constant time

    auto it1=st.find(2);//{1,2,3,4,5}
    auto it2=st.find(4);
    st.erase(it1,it2);// after erase {1,4,5,} [first,last)

    //lower_bound() and upper_bound() function works in the same way as in vector it does.

    auto it=st.lower_bound(2);
    auto it=st.upper_bound(3);


}

void explainUpperLowerBound(){
    //binary Search
    int a[]={1,4,5,8,9,9};
    bool res=binary_search(a,a+n,3);// return false
    bool res =binary_search(a,a+n,4);// return true

    // upper and lower bound works same as binary search and runs in logN

    int ind =lower_bound(a,a+n,4)-a;// lb returns pointer to 4 and ind is index of 4 which is 1//(subtraction with a.begin() worked for me this did not work)
    int ind=lower_bound(a,a+n,7)-a;// lb returns pointer to successor of 7,i.e,9 and index is 4
    int ind =lower_bound(a,a+n,10)-a;// lb returns a.end() and index is 6

    int ind=upper_bound(a,a+n,4)-a; /// ub always return the iterator to next greater element , so it points to 5 and index is 2
    int ind=upper_bound(a,a+n,7)-a;// returns 4
    int ind=upper_bound(a,a+n,10)-a;// returns 6


}

void explainMultiSet(){
    //stores sorted and duplicates also

    multiset<int>ms;
    ms.insert(1);
    ms.insert(1);
    ms.insert(1);

    ms.erase(1);// all 1's erased

    int cnt=ms.count(1);

    ms.erase(ms.find(1));// only a single one erased

    ms.erase(ms.find(1),ms.find(1)+2);//rest functions same as set
}

void explainUset(){
    //no ordering of elements but stores only unique, better time complexity(O(1)) than set in most cases, except when collision occurs(O(n))
    unordered_set<int> st;
    //lower_bound and upper_bound funtion doesn't work but rest all same as set

}

void explainMap(){
    map<int,int>mpp;// (key, value) pair and keys are unique and stored in sorted order
    map<int,pair<int,int>> mpp;
    map <pair<int,int>,int> mpp;

    // map<int,int> mpp;
    mpp[1]=2;
    mpp.emplace({3,1});
    mpp.insert({2,4});

    // mpp is:{{1,2},{2,4},{3,1}}

    mpp[{2,3}]=10;//map<pair<int,int>,int>

    for(auto it:mpp){
        cout<<it.first <<" "<< it.second <<endl;
    }

    cout<<mpp[1];
    cout<<mpp[5];

    auto it=mpp.find(3);
    cout<< *(it).second;

    auto it =mpp.find(5);// return mpp.end()

    auto it=mpp.lower_bound(2);
    auto it=mpp.upper_bound(3);


}

void explainMultiMap(){
    //everything same as map, only it can store multiple keys
    //only mpp[key] cannot be used here
}

void explainUnorderdMap(){
    //same as set and Unordered set difference
    //works in O(1) on avg but goes to O(n) in worst case
}

--Algorithms

void explainExtra(){
    sort(a,a+n); //[a,a+n)
    sort(v.begin(),v.end());
    sort(a+2,a+4);
    sort(a,a+n,greater<int>);

    //custom sorting
    pair<int,int> a[]={{1,2},{2,1},{4,1}};
    //sort it according to second element ,if 2nd elem is same then sort it according to 1st elem but in descending

    bool comp(pair<int,int>p1,pair<int,int>p2){// assumption p1 lies before p2 , true means it is correct
        if(p1.second<p2.second) return true;
        else if(p1.second==p2.second){
            if(p1.first>p2.first) return true;
        }
        return false;
    }
    sort(a,a+n,comp);
    //{4,1},{2,1}.,{1,2}

    int num=7;
    int cnt=_builin_popcount();// return 3 no os set bits
    long long num=165786578687;
    int cnt=_builtin_popcountll();

    string s="123";

    do {
        cout<<s<<endl;
    }while(next_permutation(s.begin(),s.end()));//last permuation return false,(so to get all permutation start with sorted string)

    int maxi=*max_element(a,a+n);


}

///Basic Maths      -------------------------------------------------------------------------------------------------

// Digit
N=7789
number of digits=log10(N) +1
armstrong: sum of cubes of digits equal to number
all divisors: sqrt(N)
Prime number: exact two factors 1 and itself
GCD:
    Euclidean Algo ,
        GCD(n1,n2)=gcd(n1-n2,n2) N1>N2
        better way: GCD(n1,n2)=gcd(n1%n1,n2) n1>n2 (edge case: if one is zero then other is gcd)//O(log(min(a,b)))

//Basic Recursion----------------------------------
1.Base Condition 2.stack overflow 3.Backtracking

//Hashing-----------------------------------
int hash[256]
// for character hashing we can use array , but for numbers we need more
//We use STL library: map and unordered_map

map<int,int>mpp; // time complexity for store and fetch is logn always (in Unordered map in rare case O(n) due to internal collisions)
//Also , in map any data structure can be key but in unordered_map it needs to be individual like int, string ,double etc. and cannot be pair etc.
for(int i=0;i<n;i++) mpp[arr[i]]++;
//way to iterate in the map
for(auto it:mpp) cout<<it.first<<"->"<<it.second<<endl;

//Sorting Algos----------------------------------------------------------------
selection sort : total n swaps always , finds min among remaining and swaps with the first position
grows by increasing the sorted list in the start

Bubble Sort: O(n^2) swaps at eac
max gets to last in one iteration
and sorted order grows from right to left ,ie.e the max elements accumulate in decreasing order from right

Insertion Algo: same as bubble sort but grows from left by accumulating sorting as we allow it to grow

Merge Sort:divide and merge

//Array-------------------------------------------------------------------------
//Second largest or second smallest in array (below is for 2nd largest)
if (a[i] > max)
        {
            second_max = max;
            max = a[i];
        }
        else if (a[i] < max && a[i] > second_max)
        {
            second_max = a[i];
        }

//If array is sorted or not
just like in bubble sort(final pass has no swaps) , we check if(a[i]<a[i-1]) for entire array from i=1 to n and if even one violation then not sorted

//removing duplicates in a sorted array
if (a[i] != a[k])
            a[++k] = a[i];

//left rotate an array(size n) by t places
for (int i = 0; i < t%n; i++)
        swap(a[i], a[n - t + i]);

//an array of size n-1 containing natural numbers from 1 to n but 1 is missing,find the missing natural number
brute:linear search of each n->n^2
better:hashing->space and time On
optimal: sum method , and best   XOR(since sum might need long otherwise overflow)        (xor of 0 and number is number itself)

//longest subarray with sum k
subarray:contiguous part of the array
Brute; for each possible starting position get all possible sub array sum and the longest length is recorded: space: no extra space O(1) and TIme will be O(n^3) and in best case : O(n2)

//Better:
Use Hash-Map:We move forward by considering the required sub array which will have current element as last element(Consider that sum from first element to this element be P(which is keyed into the Hash_Map if not present already(to account for zero)) and given sum be X)
so then we search if any previous element had prefix sum as P-x then  index of  element with this sum(P-X) minus that elemtn +1 will give length of sub-array with sum x ending at that
Use prefix sum : O(N*1) ()unordered map if no collision , and with ordered map O(nlogn)
Optimal when all +ve ,0 and -ve are present

// Optimal: Use two pointer approach and keep growing a window of sub arrray sum<=given sum  then when boundary crossed move the window to right ,i.e, exclude leftmost element unti sum <=given weight and keep track of longest length
Time: O(2N)
above is optimal for Positive and Zero (no negatives)

//Moderate_array---
//Two Sum (sum of etwo elements equal to the target)
Brute: O(N^2) for each element search the entire array

Better(Optimalif have to return index also): hashing ,hash all the elemnts and for each element search the remaining in hash table in O(1): Time gamma(n) and Space O(n)(with unordered map time could go to O(n^2) but generally O(n)) with ordered theta(nlogn) and space O(n)

When we just have to tell Yes or no -> Just sort then using two pointers starting from start and end, move based on sum of the elements at pointersif greater than target then move end towards start otherwise move start towards end (Time:O(N)+O(NLOGN))
    -> above approach won''t be Optimal if we have to return index

//Sort an array of 0,1,2

Brute: nlog sort
Better: single iteration three      variables count 0,1 and 2 ->Time:O(2N) and Space:O(1)
Optimal:Dutch National Flag Algorithm
uses three pointers: low,mid and high
[0...,low-1]->0 extreme left
// [low...mid-1]->1
// [high+1,n-1]->2 extreme right
 (mid....high)-> contains random 0,1,2
initially:low=mid=0 and high=n-1

a[mid]==0 then : swap(a[low],a[mid]);low++;mid++;
a[mid]==1 then: mid++;
a[mid]==2 then swap(a[mid],a[high]);high--;mid++;
000000  1111111   ~~~~~~~~  22222222
|    |  |     |   |      |  |      |
0 low-1 low mid-1 mid  high high+1 n-1

//Majority Element-I (element appearing >N/2 times)
Brute: count each and asnwer ,Time:O(n^2)
Better: Hash ,Time: O(nlogn)
Optimal:Moore's Voting Algorithm ,Time O(n) Space: O(1)
the answer returned by Moores'' is true given a majority element exist,so we check by doing a second pass of the array

//Maximum Subarray Sum
Brute: Calculate sum of all sub-array,Time:O(n^2)

Better:n(n+1)/2

Optimal:Kadane's Algorithm,TIme:O(n),Space:O(1)
carry forward only if the sum is positive otherwise make 0 and move forward

//Rearrange Array elements by Sign
//Alternate +ve and -ve  (order of -ve same as in original)
Brute: extract +ve and -ve and put them in separate arrays and the push +ve on even index and -ve on odd index(optimal when number of positive and negative are not equal)
Optimal: decrease passes by optimising above , similar but only one pass does the job and time is O(N) and sapce:O(N)

//Next permutation

// Brute: Generate all permuation and find the position of the given permutation and then get next permutation,Time: to generate n! permuations :N!*N

// Optimal:Time:O(3*N), Space: O(1)
steps:
1. find the point from right where the descending order breaks
2.Find an element from the descending list after the element which broke the order which is successor and do swap
3.Sort the descending part of list in non-descending order or just reverse it since it was already in descending order

//Leaders in an array(leader if greater than all elements to the right )
Brute:Time:O(n^2) Space:O(N)

Optimal: Time:O(N) Space:O(n) Iterate from right to left and

//Longest Consecutive subsequence

Optimal:in one pass put each element in set then only for an element which could be  start of a sequence loop and find length and if applicable update maxlen,Time:O(3*N),space:O(N)
for(auto it:s){
            if(s.find(it-1)==s.end()){
                int start=it;
                len=1;
                while(s.find(start+1)!=s.end()){
                    len++;start++;
                }
                maxlen=max(len,maxlen);
            }
        }

//Set Matrix zero ()if a cell has zero then make the row and columnn corresponding to that cell zero
Brute: Time(N^3)

Better:using array for row and column , track whcih rows and columns will be zero by traversing a matrix and for a zero mark that row or column for becoming zero,tthen in a separate pass to make zero

Optimal:
for keeping track we dont take extra space,we use the first column for the rows and for column we take first row except the first cell adn for that first column we have separate variable col0.
We iterate over entire matrix and mark in the above designated row and column.
Then , we iterate over the matrix but leaving the first row and column.We mark the cell zero if in the corresponding first row or first column we have zero.
Then we check the first cell of the matrix and if it is zero then we make the first row zero manually.
Then, if col0 variable is 0 then we mark the enitre column as 0.
Time:O(N*M) and space:O(1)

//Rotate matrix by 90deg

Brute: loop in corresponding order(i:n->1 & j:1->n)and j in outer loop(column will be outer side) and store the result in a matrix, Time:O(n^2) and Space;O(n^2)

Optimal:take transpose and reverse each row, Time:O(n^2) , Space:O(1)

//Spiral traversal of a Matrix
use four pointer: left,right,top adn bottom
print in order:while(left<=right&& top<bottom )
// 1. left to right(row top) (then top++)
// 2.top to bottom(right column)(,right--)
if(top<=bottom){
// 3.right to left(bottom row)(bottom--)
}
if(left<=right){
// 4.bottom to top (left column)(left++)
}

// Count number of sub-array with given sum
Brute:Time(O(N^3)) and space:O(1)
Better:Time(O(N^2)) when sum is build up graadually
Optimal:Use prefix sum
and stor count of each prefix sum and also store 0 as sum

//ARRAY-HARD---------------
//Pascal's Triangle
                1
            1       1
        1       2       1
    1       3       3       1
1       4       6       4       1

Three Types of Problem:
1.Given row and column tell ,give the element at theposition.Ex: R=5,C=3 :ans=6 )(4C2) (R-1)C(C-1)
2.Give Nth row of Pascal''s triangle.EX:N=5 : 1 4 6 4 1
3.Given N print entire triangle

Brute:
1.(Time: O(r)and Space:O(1)) 10C3 :   10/1 *9/2 *8/3
2.Nth row will always have n elements , so for each elemnt we call 1 , TIme O(n*r)
Optimal:Time:O(N)
1    5       10      10         5  1
1   5/1   5/1*4/2  5/1*4/2*3/3  5/1*4/2*3/3*2/4 5/1*4/2*3/3*2/4*1/5

3.OPTIMAL: O(N^2)

//Majority Element (>floor(n/3) times)
There could be at most 2 numbers possible.
Brute: for each element search and verify if it has more than >floor(n/3) , keep iterating until end or floor(n/3) numbers found.Time:O(n^2)

Better:Hashing and at the point count crosses floor(n/3) push into ans , so single iteration, Time:O(n) and Space:O(n)

Optimal:Use a modified version of Voting algorithm with two candidates and two vote counts

//3-SUM give all unique triplets whose sum is zero
Brute:Time:O(N^3),space:O(N) finad all triplets(i:1->n,j:i+1->n,k:j+1->n) and store the ones which match in a sorted order in a set
Better: we try to get rid of third loop,
We put everything between i and j in hash map(wheneever we J++ before that we hash the element pointed to by j and before i increments we clear the hash map)(not the entire array to avoid duplication)
Time: O(N^2*logn) SPACE:O(N )
Optimal:O(nlogn +N^2)
Algo:first sort then,
int i=0,j,k;
        for(i=0;i<n;i++){
            if(i>0 &&nums[i]==nums[i-1])continue;
            j=i+1;k=n-1;
            while(j<k){
                int sum =nums[i]+nums[j]+nums[k];
                if(sum<0)j++;
                else if(sum>0)k--;
                else {
                    vector<int> temp={nums[i],nums[j],nums[k]};
                    ans.push_back(temp);
                    j++;k--;

                    while(j<k &&nums[k]==nums[k+1])k--;
                    while(j<k &&nums[j]==nums[j-1])j++;
                }

            }
            //while(i<n&&nums[i]==nums[i-1])i++;
        }

//4 Sum , give all the unique quadruplets whose elemnt sum is equal to target
//Brute: O(n^4)
//Better: Hash the elements between j and k Time:O(n^3logn) and space:O(n)
//Optimal
//sort the given array
(in 3 sum , we had one fixed pointer i and we used two pointers j and k )
in 4 Sum , we have two fixed pointers i and j and two pointer k and l are used to traverse
 rest logic same
 Time: O(n^3)

// maximum sub-array with sum 0
Brute: O(N^2)
Optimal: hash the sums and corresponding index at which we get it as we traverse the array
and then , if curretn prefix sum is S and we have a S in hash table then we length by subtracting the sums,Time: O(nlogn)  Space:O(n)

//Count subarrays with XOR as K
Brute; final all subarrays then their XOR ,TIme:O(N^3) (third loop for xor of each subarray)
Better: For Xor we just xor current element to xor till previous element, TIme:O(N^2)

Optimal:|0| 4 |i| 2 2 6 4 |j|7 8
XR:xor from 0 to j,X:xor from 0 to i ,K:target
X^K=XR=> (X^K)^K=XR^K=>X=XR^K
Now apply the optimal of maximum sub-array of sum 0 (hash the xor till current along with count), also(initailly in hash-map put (0,1))

//Merge Overlapping Subintervals
Brute:
1.Sort the intervals
2.traverse for each interval  and if adjacent interval is overlapping then merge them and push in ans otherwise break, continue if given interval already overlaps with the last interval in ans
Time:O(NLOGN + 2*N)

Optimal:
1.Sort the intervals
2.in a single traversal add the superset of  overlapping intervals
algo: if(ans.empty()||ans.back()[1]<intervals[i][0]){
                ans.push_back(intervals[i]);
            }
            else ans.back()[1]=max(ans.back()[1],intervals[i][1]);

//Merge Sorted Arrays without Extra Space
Brute:Use an extra Array and keep the merged array in this, then iterate over the two inital arrays and populate as per requirement

Optimal1: START FROM  largest in 1st array and smallest in 2nd array and iterate over the two arrays, swap so that the smaller of the two is on the left and the bigger on the right
Then, sort both the  arrays.
Time:O(min(n,m))+O(nogn)+O(mlogm)
Space:O(1)

//Optimal2(Based on Shell Sort):
two pointer approach: 1st pointer at start of first array and 2nd at gap=ceil((n+m)/2)
Then, compare the elements at two pointers, if smaller is on left then good otherwise swap.Increment both the pointers.
The moment right moves out of boundary restart but this the the gap between the two pointers is updated to gap=ceil(gap/2).When we finally get gap as 1 then that will be the final iteration of outer loop .

//Find the missing and Repeating Number(Given an array of size has N natural numbers but one is missing and any one is repeated)
Brute:
for evey N in 1 to N we check ,Time:O(N^2)
Better: Hashing , Time:O(2*N) and Space:O(N)
Optimal1:(Maths Based)
S1:sum of elements of array, S:Sum of 1 to N (N*(N+1)/2),X:repeating number, Y:missing number
SS1:sum of squares of element,SS:sum of squares of 1 to N
X-Y=S1-S
X+Y=(SS1-SS)/(s1-S)

Optimal2:(XOR Method)
XR1:xor of all elements of array and elements of 1 to N
X:repeating number, Y:missing number
X^Y=XR1
find the rightmost non zero bit position in XR1 , this will give us one bit position at whcih X and Y differs.loop until(XR1 &(1<<bitNo++)!=0)
OR better: number=XR &~(XR-1);

Now we have two groups of numbers one having 0 at that bit position and others having 1 at that posistion
We take two groups zero and One.
And based on value at bit position we xor it with zero group or one group.
DO the same for 1->N , Now Zero and One gives repeating and missing , and by traversing the array we verify which is which.

//Count Inversions
//Brute: O(n^2)
Optimal:
//Use the exact merge sort algorith with just one line addition:
 if (b[bi] < c[ci])
            a[it++] = b[bi++];
        else{
            a[it++] = c[ci++];
            cnt+=mid-left+1;
        }
//intuition: [2,3,5,6] [2,2,4,4,8] COUNT=3+3+2+2 (usign two pointers one traversing in the left and the other traversing in the right)
The intuition stems from the fact that during the merging of two sorted subarrays, if an element from the right subarray is smaller than one from the left, it is smaller than all remaining elements in that left subarray, indicating multiple inversions.

Divide and Conquer: The algorithm recursively splits the array into single-element subarrays. Inversions within these smallest subarrays are zero, forming a base case. This division means every potential inversion pair (arr[i], arr[j] where i < j and arr[i] > arr[j]) will eventually be handled in one of three categories:
Both elements are in the left half.
Both elements are in the right half.
One element is in the left and the other in the right half (a "split inversion").
Recursive Counting: The inversions within the left and right halves are counted recursively and summed up.
Total Count: The total number of inversions is the sum of inversions from the left half, the right half, and the split inversions counted during the merge process.
Time:O(NlogN), Space:O(N)
(also we are altering the original array)
//Reverse Pairs (pair if left is greater than twice of right )
Brute: O(N^2)
OPtimal:
[6 13 21 25] [1 2 3 4 4 5 9 11 13]
Algo: merge sort will be used but different from count of inversions
Before Merging the two sorted arrays we traverse the two arrays to find out count then in a separate traversal we merge the arrays unlike in count of inversions where we did both in one traversal only.
1st pointer i & 2nd pointer j starts with first of each array. Then , for given i we find all the right part of pair possible then we stop at j not applicable, then for next i we start from j where we stopped.
Time:O(2nlogn) Space: O(N)
We are distorting the array and if problem then take a copy and then solve.

//Maximum sub array product of given array
Brute:find all subarray O(N^2)

Optimal1:The product of elements in a subarray can become large when there are positive numbers, but negative numbers and zeros make it tricky. A negative number can flip a large product into a negative one, but if we meet another negative later, the sign flips back to positive. Therefore, to capture all possible max products, we do two things:
Traverse the array from left to right (prefix) to build cumulative product.
Traverse the array from right to left (suffix) to catch subarrays ending at the back (helpful when max product is at the end or due to even negatives).
Reset the product to 1 whenever a zero is found, as it breaks the subarray continuity.
By comparing products in both directions at each step, we ensure we don’t miss any possible maximum.

Optimal2:In a product-based subarray problem, a negative number can flip the sign, turning a big minimum into a potential maximum. So, we track both the maximum and minimum products at each step. This helps handle negative numbers effectively.
Start by setting the answer, current max product, and current min product to the first number.
For each number in the array starting from the second:
If the number is negative, swap current max and min.
If the product of the current number and previous max is larger than the number itself, update current max to that product; otherwise, set it to the number.
Similarly, if the product of the current number and previous min is smaller, update current min; otherwise, set it to the number.
If the current max is greater than the answer so far, update the answer.
Return the answer at the end.
for(int i=1;i<n;i++){
            if(nums[i]<0)swap(minP,maxP);

            maxP=max(maxP*nums[i],nums[i]);
            minP=min(minP*nums[i],nums[i]);
            ans=max(ans,maxP);

        }

// Binary Search-------------------------------------------------------------------------

//BS-1------------------------------
//Binary Search -Iterative and Recursive version
Time;O(logN) Space:O(1)
Iterative:
// Keep searching until low crosses high
        while (low <= high) {
            int mid = (low + high) / 2; // Find the middle index
            if (nums[mid] == target) return mid;       // Target found
            else if (target > nums[mid]) low = mid + 1; // Search in right half
            else high = mid - 1;                        // Search in left half
        }
        return -1;
Recursive:
     int binarySearch(vector& nums, int low, int high, int target) {
        if (low > high) return -1; // Base case: target not found

        // Find middle index
        int mid = (low + high) / 2;

        // If target is found at mid
        if (nums[mid] == target) return mid;
        // If target is greater, search right half
        else if (target > nums[mid])
            return binarySearch(nums, mid + 1, high, target);
        // Otherwise, search left half
        return binarySearch(nums, low, mid - 1, target);
    }

// Overflow Case: when low=0 and high=INT_MAX, then if search goes till tlast element then
mid=(INT_MAX+INT_MAX)/2 //this will give overflow error
two solutions:
1.take low and high as long long
or 2. mid=low+((high-low)/2)

//Lower Bound(smallest index such tht arr[ind]>=target)
Optimal:(In C++,lower_bound(arr.begin(),err.end(),n))
int ans = n;           // Default to n (not found)

        // Binary search loop
        while (low <= high) {
            int mid = (low + high) / 2;  // Middle index
            //In Binary Search we had three possibilities >,< and ==, but here just two-> may be an answer or not an answer
            if (arr[mid] >= x) {
                ans = mid;           // Store possible answer
                high = mid - 1;      // Try to find smaller index on left side
            } else {
                low = mid + 1;       // Move right if current element is less than x
            }
        }

//Upper_Bound
smallest index such that arr[index]>n
Optimal: Just change to if (arr[mid] > x) to lower_bound
Stl:upper_bound()

//Search insert position : lower_bound
//Floor and ceil in Sorted Array:
//largest number in array <=x:Floor(We need number not the index)
     if (arr[mid] <= x) {
                ans = arr[mid];     // Potential floor
                low = mid + 1;      // Search right side
            } else {
                high = mid - 1;     // Search left side
            }
//smallest no in array>=x:Ceil(lower_bound)

//find the first and last occurrence of x
lower_bound-> gives first occurence index
upper_bound()->index just after the last index of x
extreme condition: if(lb(x)==n||arr[b]!=x) return {-1,-1}

//find index of  element in rotated sorted array
Optimal:low=0,high=n-1
 // Continue until the search space becomes invalid
        while (low <= high) {
            // Find the middle index
            int mid = (low + high) / 2;
            // If the target is found at mid, return mid
            if (nums[mid] == target)    return mid;
            // Check if the left half is sorted
            if (nums[low] <= nums[mid]) {
                // If target lies in the sorted left half, search there
                if (nums[low] <= target && target < nums[mid])  high = mid - 1;
                // Else search in the right half
                else low = mid + 1;
            }
            // Otherwise, right half is sorted
            else {
                // If target lies in the sorted right half, search there
                if (nums[mid] < target && target <= nums[high]) {
                    low = mid + 1;
                }
                // Else search in the left half
                else high = mid - 1;
            }
        }

//find index of  element in rotated sorted array(with duplicates)
Optimal: the above algo doesn''t work n certain cases, ex: 3 1 2 3 3 3 3 ,When arr[low]=arr[mid]=arr[high]
Solution: We trim down this condition(low++,high--)

Time:O(n/2)

//minimum in Rotated Sorted Array
maintain an ans variable,keep the minimum of the  sorted half and remove the sorted space as it will not have the minimum,
minimum will be the point of rotation
so we again search in the unsorted section and continue like this

// Find number of times array is rotated
Optimal: fin the index of min element use the above algo

//single element in sorted array(except 1 all elements in array are repeated eactly twice)
Optimal: use binary search , eliminate the side
not having the element using following logic:
(even,odd)-> element is on right half
(odd,even)-> element is on the left half
if none left or righ element of mid is not equal to mid then that is the unique

to reduce edge conditins we reduce search space to: 1:(n-2) (rather than 0-(n-1))

//Peak element (in array find peak)
following algorithm return any one of the peaks
 OPTIMAL:if(n==1||nums[0]>nums[1]) return 0;
        if(nums[n-1]>nums[n-2]) return n-1;
        int low=1,high=n-2;
        while(low<=high){
            int mid=low +(high-low)/2;
            if(nums[mid]>nums[mid-1]&&nums[mid]>nums[mid+1])return mid;
            else if(nums[mid]>nums[mid-1]){
                low=mid+1;
            }
            else high=mid-1;
        }
        return -1

// Binary Search-II : Binary Search on Answers -------------------------------------------------------------------------------------------------------
//Finding Sqrt of a Number using Binary Search
(we return the floor value)
//Brute: iterate from i=1 to n/2 , until i*i>=n
//Optimal:use binary search to reduce to search space

//Finding Nth root of a number N
Optimal:
    // Function to find N-th root of M using binary search
    int nthRoot(int n, int m) {
        // Set low and high for binary search
        int low = 1, high = m;

        // Start binary search
        while (low <= high) {
            // Calculate mid
            int mid = (low + high) / 2;

            // Store result of mid^n
            long long ans = 1;
            for (int i = 0; i < n; i++) {
                ans *= mid;
                if (ans > m) break;
            }

            // If mid^n equals m
            if (ans == m) return mid;

            // If mid^n is less than m
            if (ans < m) low = mid + 1;

            // If mid^n is more than m
            else high = mid - 1;
        }

        // Return -1 if not found
        return -1;
    }

//Koko eating bananas:return the min integer k such that koko can eat all bananas within h hours (k->bananas/hr)
ex: [3 6 7 11] h=8
rate will be between 1 and 11
so we traverse the range 1 to 11 using Binary Search
Time:nlogn

//Minimum days to make M bouquets
Bloom Day=[7 7 7 7 13 11 12 7] (day on which flower i(index) blooms) M=2(no of bouquets) k=3 (adjacent flowers required for 1 bouquet)
Optimal:
No answer : if M*K >n then return -1
answer lies between minimum bloom day to maximum bloom day-> find using binary search

//Find the smallest divisor given a threshold
      arr[]=[1 2 5 9] threshold=6
Divisor(4):  1 1 2 3 =7 >6 (not possible)
Divisor(5):  1 1 1 2 =5 <6 (possible)
and hendeforth all will give <6
ans would be 5
Optimal: divisor between 1 and max of array, use Binary Search

//Least Capacity(of ship) to ship packages within D days
we got 1 ship and ship runs once per day.
ex: arrayof loads : [1 2 3 4 5 6 7 8 9 ]
Optimal: Binary search between max of array and sum of elements of array
-->we return the low in this case
//Find Kth missing number
ans[]=[2 3 4 7 11] k=5
missing: 1 5 6  8 9 10 , therefore, 5th missing is 9.
Optimal:
 while(low<=high){
            int mid=low+(high-low)/2;
            if(arr[mid]-(mid+1)>=k){
                high=mid-1;
            }
            else low=mid+1;
        }
        return low+k;

//Binary Search on min of max or max of min
//Aggressive Cows (min dist between cows is max)
arr[]=[0 3 4 5 10 9] cows=4
->Since we are concerned with min we just take consecutive stall distances.
->We sort the array and put 1st cow at first position.
->min distance can be in range: [1,(max-min)] (in place of 1 we can take min of consecutive distances)
-> we use binary search and at last return high.
 for (int i = 1; i < stalls.size(); i++) {
            // Check if this stall is at least 'd' away from last placed cow
            if (stalls[i] - lastPos >= d) {
                // Place the cow here
                count++;
                // Update last placed cow position
                lastPos = stalls[i];
            }
            // If all cows are placed successfully
            if (count >= cows) return true;
        }
        // Return false if we could not place all cows
        return false;
 int aggressiveCows(vector<int>& stalls, int cows) {
        // Sort the stalls
        sort(stalls.begin(), stalls.end());

        // Define search space
        int low = 1;
        int high = stalls.back() - stalls.front();
        int ans = 0;

        // Apply binary search
        while (low <= high) {
            // Find mid distance
            int mid = low + (high - low) / 2;

            // If placing cows is possible with mid distance
            if (canPlace(stalls, cows, mid)) {
                // Store this as potential answer
                ans = mid;
                // Try to find larger minimum distance
                low = mid + 1;
            }
            else {
                // Otherwise try smaller distance
                high = mid - 1;
            }
        }
        // Return the largest minimum distance
        return ans;// high can also be returned
    }
};

//Allocate Books(Maximum number of pages allocated to a student is minimum)
ex: arr[]=[12 34 67 90] n=4 students=2
conditions:1> A book will be allocated to one student 2>each studetn must get a minimum of 1 book 3>allotment should be in contiguos order
possibilities: 12 | 34 67 90
               12 34 | 67 90
               12 34 67 | 90 (Answer)
Optimal : Binary Search:
min could be the book with the minimum page number and max could be the sum of all book pages: low=12,high=203
mid =107: iterate over the array and keep adding so that the sum is less than 107 and allot to  a student and then continue with 0 sum for next, return if possible or not(with 107:  1-> 12+34 ; 2->67 ;3->90 : SO not possible since we have to allot to just two students, SO we need to increase the barrier )

// painter's partition/ Split array-largest Sum
min(max time aloted to one painter )
ex: arr[]=[10 20 30 40 ] k=2 (painters )
ans: [10 20 30] [40] -> min maximum is 60
Split array-largest Sum: min (max sub array sum when array is split into non empty k sub arrays)

//Minimise maximum Distance between Gas Stations (Binary Search on Decimal Nummbers)
ex: arr[]=[1 2 3 4 5](coordinates of gas stations) k=4(number of new gas stations to be placed)
Note: Answers within 10^-6 of the acutal answer will be accepted
first six decimal places matching
Points:
1.placing the gas stations beyond the extremes doesn''t make sense as the max distance still remains same
2.FOR A GIVEN STATION WE PLACE IT BETWEEN THE STATIONS WHERE THERE IS MAXIMUM GAP
bRUTE: o(K*n)+N(TO FIGURE OUT MAXIMAL)
Better: We use Priority Queue(Max-Heap) to store length of section and index of section
Time:O(NLOGn) and space:O(N-1)

Optimal:We use Binary Search but the genereic pattern we used so far won't work.
// Function to calculate number of gas stations required such that
    // no segment exceeds the max allowed distance `dist`
    int numberOfGasStationsRequired(long double dist, vector<int> &arr) {
        int n = arr.size();
        int cnt = 0;

        for (int i = 1; i < n; i++) {
            // Number of stations needed between arr[i-1] and arr[i]
            int numberInBetween = (arr[i] - arr[i - 1]) / dist;

            // If perfectly divisible, reduce one to avoid extra placement
            if ((arr[i] - arr[i - 1]) == (dist * numberInBetween)) {
                numberInBetween--;
            }
            cnt += numberInBetween;
        }
        return cnt;
    }

    // Function to minimize the maximum distance between gas stations
    long double minimiseMaxDistance(vector<int> &arr, int k) {
        int n = arr.size();
        long double low = 0, high = 0;

        // Determine max initial distance between stations
        for (int i = 0; i < n - 1; i++) {
            high = max(high, (long double)(arr[i + 1] - arr[i]));
        }

        long double diff = 1e-6;

        // Binary search to find minimum possible maximum distance
        while (high - low > diff) {
            long double mid = (low + high) / 2.0;
            int cnt = numberOfGasStationsRequired(mid, arr);
            if (cnt > k) low = mid;
            else high = mid;
        }

        return high;
    }'

//Median of two sorted arrays(Hard)
Brute: merge and then find median
Optimal: since sorted we use binary search
We use two pointer approach and always half of the eleemnts will be on left and half on right , and using these two pointers we get l1(max on left half from array 1)  and l2(max on left half from array 12) and r1(max on right half from array 1) and r2(max on right half from array 2). Using these four we determine if the number of partitions is correct : For correct: l1 will be less than r2 and l2 will be less than r1.
Algo:
if(nums1.size()>nums2.size())return findMedianSortedArrays(nums2,nums1);
        int n1=nums1.size();
        int n2=nums2.size();
        int low=0,high=n1;
        while(low<=high){
            int cut1=(low+high)>>1;
            int cut2=(n1+n2+1)/2-cut1;

            int left1=cut1==0?INT_MIN:nums1[cut1-1];
            int left2=cut2==0?INT_MIN:nums2[cut2-1];
            int right2=cut2==n2?INT_MAX:nums2[cut2];
            int right1=cut1==n1?INT_MAX:nums1[cut1];
            if(left1<=right2 && left2<=right1){
                if((n1+n2)%2==0) return (max(left1,left2)+min(right1,right2))/2.0;
                else return max(left1,left2);
            }
            else if(left1>right2)high=cut1-1;
            else low=cut1+1;

        }
        return 0.0;

//Kth element of two sorted arrays
Optimal: similar to above except:
low=max(k-n2,0) ,high=min(k,n1);
            int mid1 = (low + high) >> 1;
            int mid2 = left - mid1;
            // Initialize l1, l2, r1, r2
            int l1 = (mid1 > 0) ? a[mid1 - 1] : INT_MIN;
            int l2 = (mid2 > 0) ? b[mid2 - 1] : INT_MIN;
            int r1 = (mid1 < m) ? a[mid1] : INT_MAX;
            int r2 = (mid2 < n) ? b[mid2] : INT_MAX;
            // Check if we have found the answer
            if (l1 <= r2 && l2 <= r1) {
                return max(l1, l2);
            }
            else if (l1 > r2) {
                // Eliminate the right half
                high = mid1 - 1;
            }
            else {
                // Eliminate the left half
                low = mid1 + 1;
            }

//Binary Search -2D Matrix -----------------------------------------------------------------------------------
//Row with maximum number of 1s(2d array with sorted rows of 0 and 1)
Optimal: do lower_bound on 1 , to find number of 1s in each row and thus we find the maximum by iterating over the rows.Time:nlogn

//Search in a 2D Matrix-I (a sorted array is stored in a matrix row-wise)
Optimal: take and index and use binary search as usual , just row=index/NO_OF_COLUMNS and columns=index%NO_OF_COLUMNS
a
//Search in a 2D Matrix-IIa
Given: a matrix where each row is sorted and each column is sorted
Brute:N*N
Better: N*logN (BS in each row)
Optimal:start with row=0 and col=n-1(given m rows ad n column)(because to the left of this element it is decreasing and to down of this it is increasing)
We either eliminate the row or the column
(we can also start from row=m-1 and col=0 but row=0 and col=0 or row=m-1 and col=n-1 cannot be starting point as both in the row and column side they have either increasing or decreasing ,so we cannot eliminate)(mth row is m-1 index wise)
Time:O(m+n)
Here , binary search was not applied but the concept of elimination was applied
Algo:
  int row=0,col=n-1;
        while(row<m&&col>=0){
            if(matrix[row][col]==target)return true;
            else if(matrix[row][col]>target) col=col-1;
            else row=row+1;
        }
//find a peak element-II (peak is greater than left ,right and bottom and top element)
for an element at the extremety its adjeacent is taken to be -1.
brute: n*m*4
better: return the largest element in matrix. Time(n*m)
Optimal:We take the middle column , then find max element then we just need to check left and right and thus it boils down to 1d array, now if left is greater then we remove right , and then check in that column, again we take max and check for peak and so on.

// Median in a Row-wise Sorted MAtrix
Brute: add the elemtns in  a list and sort the list , then return the median. Time:n*m
OPtimal: number of elements less than equal to median has to be greter than the number of elements in the left of median.
aLGO:int countLessEqual(vector<int>& row, int mid) {
        // Using upper_bound to find count efficiently
        return upper_bound(row.begin(), row.end(), mid) - row.begin();
    }

    // Function to find median
    int findMedian(vector<vector<int>>& matrix) {
        // Number of rows and columns
        int rows = matrix.size();
        int cols = matrix[0].size();

        // Minimum possible element in matrix
        int low = matrix[0][0];

        // Maximum possible element in matrix
        int high = matrix[0][cols - 1];
        for (int i = 1; i < rows; i++) {
            low = min(low, matrix[i][0]);
            high = max(high, matrix[i][cols - 1]);
        }

        // Binary search over the value range
        while (low < high) {
            int mid = (low + high) / 2;

            // Count elements ≤ mid
            int count = 0;
            for (int i = 0; i < rows; i++) {
                count += countLessEqual(matrix[i], mid);
            }

            // If count is less than half, median is greater
            if (count < (rows * cols + 1) / 2)
                low = mid + 1;
            else
                high = mid;
        }

        // Final low is the median
        return low;
    }

//Strings-Basic and Easy string Problems ------------------------------------------------------------------------------------------------------------------
//1021. Remove Outermost Parentheses
A valid parentheses string is either empty "", "(" + A + ")",
or A + B, where A and B are valid parentheses strings,
 and + represents string concatenation.
A valid parentheses string s is primitive if it is nonempty,
 and there does not exist a way to split it into s = A + B,
  with A and B nonempty valid parentheses strings.
Given a valid parentheses string s, consider its primitive
 decomposition: s = P1 + P2 + ... + Pk,
  where Pi are primitive valid parentheses strings.
Return s after removing the outermost parentheses of
 every primitive string in the primitive decomposition of s.
Optimal:int level = 0;
        for (char ch : s) {
            if (ch == '(') {
                if (level++ > 0) result += ch;
            }
            else if (ch == ')') {
                if (level-- > 0) result += ch;
            }
        }
        return result;
//205. Isomorphic Strings
Given two strings s and t, determine if they are isomorphic.
Two strings s and t are isomorphic if the characters in s can be replaced to get t.
All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.
ex: bacd  add
    baba  egg
algo:vector<int> s1(256,-1);vector<int> s2(256,-1);
        // bool result=true;
        for(int i=0;i<s.length();i++){

            if((s1[s[i]]!=-1 && s2[t[i]]!=-1)&&s1[s[i]]==s2[t[i]]){
                s1[s[i]]=i;
                s2[t[i]]=i;
            }
            else if(s1[s[i]]==-1 && s2[t[i]]==-1){
                s1[s[i]]=i;
                s2[t[i]]=i;
            }
            else return false;
        }
        return true;

//796. Rotate String
Given two strings s and goal, return true if and only if s can become goal after some number of shifts on s.
A shift on s consists of moving the leftmost character of s to the rightmost position.
For example, if s = "abcde", then it will be "bcdea" after one shift.
Optimal:string check=s+s;
        if(s.length()!=goal.length())return false;
        return check.find(goal)!=string::npos;

// Count Number of Substrings
You are given a string s and a positive integer k.
Return the number of substrings that contain exactly k distinct characters.
ex: s = "pqpqs", k = 2
"pq", "pqp", "pqpq", "qp", "qpq", "pqs", "qs"
Total = 7.
Optimal:
// Function to count substrings with at most k distinct characters
int atMostKDistinct(string s, int k) {
    // Left pointer and result
    int left = 0, res = 0;
    // Frequency map
    unordered_map<char, int> freq;

    // Iterate through string with right pointer
    for (int right = 0; right < s.size(); right++) {
        // Add current character
        freq[s[right]]++;

        // Shrink window if distinct characters exceed k
        while (freq.size() > k) {
            freq[s[left]]--;
            if (freq[s[left]] == 0) freq.erase(s[left]);
            left++;
        }

        // Count substrings in current window
        res += (right - left + 1);
    }
    return res;
}

// Function to count substrings with exactly k distinct characters
int countSubstrings(string s, int k) {
    // Exactly k = atMost(k) - atMost(k-1)
    return atMostKDistinct(s, k) - atMostKDistinct(s, k - 1);
}


//5. Longest Palindromic Substring(medium)
Given a string s, return the longest palindromic substring in s.
Algo:int palLength(string &s,int left,int right)    {
        while(left>=0&&right<s.length()&&s[left]==s[right]){
            left--;right++;
        }
        return right-left-1;
    }
    string longestPalindrome(string s) {
        int n=s.length();
        int maxlen=0,start=0;
        for(int i=0;i<n;i++){
            int len1=palLength(s,i,i);
            int len2=palLength(s,i,i+1);
            int len=max(len1,len2);
            if(len>maxlen){
                maxlen=len;
                start=i-(len-1)/2;
            }
        }
        return s.substr(start,maxlen);
    }

//Linked list ------------------------------------------------------------------
1.Introduction to Linked List ------------------------------
Used in : stack,Queues and Browsers(tab history stored in 2D LL)

//Syntax: use class or struct to define node but prefer Class (also include a constructor to set the data nd next pointer)
class Node
{
public:
    int data;
    Node *next;

public:
    Node(int data1, Node *next1)
    {
        data = data1;
        next = next1;
    }

public:
    Node(int data1)
    {
        data = data1;
        next = nullptr;
    }
};

Node *ConvertToLL(vector<int> &arr)
{
    Node *head = new Node(arr[0]);
    Node *mover = head;
    for (int i = 1; i < arr.size(); i++)
    {
        Node *temp = new Node(arr[i]);
        mover->next = temp;
        mover = temp;
    }
    return head;
}

 On a 32-bit system: (int:4 bytes and pointer:4 bytes ->total 8 bytes ) ,64-bit system: (int:4 bytes and pointer:8 bytes ->total 12 bytes )
//Deletion and insertion in LL
Node *deleteEl(Node *head, int k)
{
    if (head == NULL)
        return head;
    if (head->data == k)
    {
        Node *temp = head;
        head = head->next;
        free(temp);
        return head;
    }
    // int count = 0;
    Node *temp = head;
    Node *prev = NULL;
    while (temp)
    {
        // count++;
        if (temp->data == k)
        {
            prev->next = prev->next->next;
            free(temp);
            return head;
        }
        prev = temp;
        temp = temp->next;
    }
    return head;
}

Node *insertAtPos(Node *head, int k,int x)
{
    if (head == NULL){
        if (k==1) return new Node(x);
        else return head;
    }

    if (k == 1)
    {
        return new Node(x,head);
    }
    int count = 0;
    Node *temp = head;
    while (temp)
    {
        count++;
        if (count == k-1)
        {
            temp->next = new Node(x,temp->next);
            // free(temp);
            break;
        }
        temp = temp->next;
    }
    // temp=new Node(x,temp->next);
    // prev->next=temp;
    return head;
}

//237. Delete Node in a Linked List
There is a singly-linked list head and we want to delete a node node in it.
You are given the node to be deleted node. You will not be given access to the first node of head.
All the values of the linked list are unique, and it is guaranteed that the given node node is not the last node in the linked list.
Delete the given node. Note that by deleting the node, we do not mean removing it from memory. We mean:
The value of the given node should not exist in the linked list.
The number of nodes in the linked list should decrease by one.
All the values before node should be in the same order.
All the values after node should be in the same order.
Optimal:ListNode * temp=node->next;
        node->val=temp->val;
        node->next=temp->next;

//middle element of the Linked List
Brute: two pass algo, first we get toal number of nodes , then find middle
Optimal:Tortoise-Hare method: two pointers slow and fast,slow moves 1 nodes at a time and fast moves two nodes at a time

//Detect a loop in a linked list
Brute:Use hashing to detect the loop
Optimal: Use Tortoise and Hare method,if a loop exists then fast and slow will surely coincide over time.

//Find the starting point of the Loop/Cycle in Linked List
Brute: Use hash-map
Optimal:
1.Detect the loop
2.make the slow point to head and move both the fast(initially pointing to where they collided during detection) and the second one node at a time and the point where they collide again is the starting point.

for the second collision:(analyse using a loop and you will get answer to below)
Q> How we are sure that they will collide?:
Q> How are we sure that the collision point will be start?:
//Length of loop in LL
OPtimal: Use tortoise and hare and then,
iterate in the loop one of the pointers after overlap

//check if a LL is Palindrome
Brute: in one pass push in stack,in second pass pop from stack and compare .
Optimal: Use slow and fast, to find the middle and then reverse the second half of the list and then compare and then again reverse back the list

//Odd Even Linked List:Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.
Optimal: if (!head || !head->next) return head;
        ListNode* odd = head;ListNode* even = head->next;
        ListNode* evenHead = even;
        while (even && even->next) {
            odd->next = even->next;
            odd = odd->next;

            even->next = odd->next;
            even = even->next;
        }
        odd->next = evenHead;
        return head;

//Remove Nth Node from the end of the LinkedList
Optimal:ListNode* fast=head;ListNode * slow=head;

        for(int i=0;i<n;i++)fast=fast->next;
        if(fast==NULL ) return head->next;
        while(fast->next){
            slow=slow->next;
            fast=fast->next;
        }
        ListNode* delNode=slow->next;
        slow->next=delNode->next;
        delete delNode;
        return head;

//Sort LL
Optimal:
class Solution {
private:  //1 2 3 4  5 6 7 8
    ListNode* middle(ListNode* head)    {//gives left middle
        ListNode* slow=head;
        ListNode*fast=head->next;
        while(fast!=NULL&&fast->next!=NULL){
            slow=slow->next;
            fast=fast->next->next;
        }
        return slow;
    }
private:
    ListNode* Merge(ListNode* Left,ListNode* Right)    {
        // ListNode*Dummy=new ListNode();
        // ListNode*temp=Dummy;
        ListNode Dummy; // Created on the stack*****************************
        ListNode* temp = &Dummy; // Pointer to the stack-allocated dummy
        while(Left!=NULL&&Right!=NULL){
            if(Left->val<Right->val){
                temp->next=Left;
                temp=Left;
                Left=Left->next;
            }
            else{
                temp->next=Right;
                temp=Right;
                Right=Right->next;
            }
        }
        if(Left)temp->next=Left;
        else temp->next=Right;
        return Dummy.next;;
    }
public:
    ListNode* sortList(ListNode* head) {
        if(head==NULL ||head->next==NULL)return head;
        ListNode*mid=middle(head);
        ListNode* temp=mid->next;
        mid->next=NULL;
        // cout<<head->val<<" "<<temp->val<<endl;
        ListNode*Left=sortList(head);ListNode*Right=sortList(temp);
        return Merge(Left,Right);
    }
};

//Sort a LinkedList of 0,1 and 2
Optimal: uSe:Node *DummyOne = new Node(-1);
    Node *DummyTwo = new Node(-1);
    Node *DummyZero = new Node(-1);
    Node *Zero = DummyZero;
    Node *One = DummyOne;
    Node *Two = DummyTwo;

//160. Intersection of Two Linked Lists
Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.
Better:Find length of each list and then move in the larger list forward by distance equal to difference between two lists.Then, move simultaneously to get tot he answer.
Optimal:
t1->head1 and t2->head2 , now travere t1 in first list completele and then start from second and same for t2 .Both would have travelled: length of their own list + the extra from the other. Thus the sum of total distance will be same for both.

//Add One to a number represented by Linked List
Optimal:
// Recursive function to add one from least significant digit (rightmost node)
    int addOneUtil(Node* node) {
        // Base case: when reaching beyond last node, return carry = 1
        if (!node) return 1;

        // Recurse to the end
        int carry = addOneUtil(node->next);
        int sum = node->data + carry;
        node->data = sum % 10;
        // Return new carry
        return sum / 10;
    }

    // Function to add one to the number represented by the linked list
    Node* addOne(Node* head) {
        // Perform recursive addition
        int carry = addOneUtil(head);

        // If carry remains after processing the head, create a new head node
        if (carry) {
            Node* newHead = new Node(carry);
            newHead->next = head;
            head = newHead;
        }

        return head;
    }
};

//2. Add Two Numbers
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
Optimal:
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode Dummy;
        ListNode* temp=&Dummy;
        int carry=0;
        while(l1!=NULL||l2!=NULL||carry){
            int sum=0;
            if(l1!=NULL){
                sum+=l1->val;
                l1=l1->next;
            }
            if(l2!=NULL){
                sum+=l2->val;
                l2=l2->next;
            }
            sum+=carry;
            carry=sum/10;
            ListNode * New=new ListNode(sum%10);
            temp->next=New;
            temp=temp->next;
        }
        return Dummy.next;

//medium questions on Doubly Linked-List

//Find pairs with given sum in sorted DLL
Optimal: same as array

//Hard Linked List problems---------------------------------------
//Reverse Nodes in K Group Size of LinkedList

//Recursion ----------------------------------------------------------------

//Count Good Numbers
A digit string is good if the digits (0-indexed) at even indices are even and the digits at odd indices are prime (2, 3, 5, or 7).(1 <= n <= 1015)
Given an integer n, return the total number of good digit strings of length n. Since the answer may be large, return it modulo 109 + 7
Optimal:long long power(long long base, long long exp) {
        long long res = 1;
        long long MOD = 1e9 + 7;
        base %= MOD; // Ensure base is within modulo range

        while (exp > 0) {
            if (exp % 2 == 1) { // If exp is odd, multiply base with result
                res = (res * base) % MOD;
            }
            base = (base * base) % MOD; // Square the base
            exp /= 2; // Halve the exponent
        }
        return res;
    }

    int countGoodNumbers(long long n) {
        long long MOD = 1e9 + 7;

        // Calculate the number of positions for even digits (0, 2, 4, 6, 8)
        // These are at indices 0, 2, 4, ...
        // The count is ceil(n/2)
        long long even_positions_count = (n + 1) / 2;

        // Calculate the number of positions for prime digits (2, 3, 5, 7)
        // These are at indices 1, 3, 5, ...
        // The count is floor(n/2)
        long long odd_positions_count = n / 2;

        // Calculate (5 ^ even_positions_count) % MOD
        long long ways_for_even_positions = power(5, even_positions_count);

        // Calculate (4 ^ odd_positions_count) % MOD
        long long ways_for_odd_positions = power(4, odd_positions_count);

        // The total number of good numbers is the product of these two, modulo MOD
        return (ways_for_even_positions * ways_for_odd_positions) % MOD;

//reverse a stack
Optimal:void insertAtBottom(stack<int> &st, int val) {
    // If stack is empty, push the value
    if (st.empty()) {
        st.push(val);
        return;
    }

    // Pop the top element
    int topVal = st.top();
    st.pop();

    // Recurse for the rest of the stack
    insertAtBottom(st, val);

    // Push the popped element back
    st.push(topVal);
}

// Function to reverse the stack
void reverseStack(stack<int> &st) {
    // Base case: If stack is empty, return
    if (st.empty()) return;

    // Pop the top element
    int topVal = st.top();
    st.pop();

    // Recursively reverse the remaining stack
    reverseStack(st);

    // Insert the popped element at the bottom
    insertAtBottom(st, topVal);
}

//Power set of string
Better;recrsive approach(but space and time both O(2^n*n))
Optimal:vector<string> getSubsequences(string s) {
        // Length of input string
        int n = s.size();

        // Total subsequences = 2^n
        int total = 1 << n;

        // Vector to store all subsequences
        vector<string> subsequences;

        // Iterate over all bit masks from 0 to 2^n - 1
        for (int mask = 0; mask < total; mask++) {
            // Temporary subsequence string
            string subseq = "";

            // Check each bit position in mask
            for (int i = 0; i < n; i++) {
                // If i-th bit of mask is set, include s[i]
                if (mask & (1 << i)) {
                    subseq += s[i];
                }
            }

            // Store the formed subsequence
            subsequences.push_back(subseq);
        }

        // Return all generated subsequences
        return subsequences;
    }
};
TIme:O(2^n*n) and Space:O(1)

//All Kinds of pattern in recursion
1.Pointing all subsequences whose sum is k
 use concept of : (take | not-take)

2.Printing anysubsequence whose sum is k
-?use flag and if set then return and dont

3.IF subsequence with sum==k exists:
base case: return true if condition satisfied
if for first call true returned then dont go for second and simply return
4.Count the subsequences with sum=k
base case
    return 1/0 if satisfied/or not
l=f()
r=f()
return l+r;

//Combination Sum-I
Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.
The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
Optimmal:       void recursiveSum(int ind,int target,vector<int> &candidates,vector<vector<int>> &result,vector<int> &curr){
            // cout<<ind<<" "<<target<<" "<<endl;

            if(ind==candidates.size()){
                if(target==0)
                    result.push_back(curr);
                return;
            }
            if(target==0){
                result.push_back(curr);
                return;
            }

            if(candidates[ind]<=target){
                curr.push_back(candidates[ind]);
                recursiveSum(ind,target-candidates[ind],candidates,result,curr);
                curr.pop_back();
            }

            recursiveSum(ind+1,target,candidates,result,curr);
        }
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> curr;
        recursiveSum(0,target,candidates,result,curr);
        return result;
    }

//combination Sum-II---Imp*********
Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target. Each number in candidates may only be used once in the combination..
example:Input: candidates = [2,5,2,1,2], target = 5 -> Output: [[1,2,2],[5]]
Optimal: void recursiveSum(int ind,int target,vector<int> &candidates,vector<vector<int>> &result,vector<int> &curr){

            if(target==0){
                result.push_back(curr);
                return;
            }
            for(int i=ind;i<candidates.size();i++){
                if(i>ind && candidates[i]==candidates[i-1])continue;

                if(candidates[i]<=target){
                    curr.push_back(candidates[i]);
                    recursiveSum(i+1,target-candidates[i],candidates,result,curr);
                }
                else break;
                 curr.pop_back();
            }
        }
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> curr;
        sort(candidates.begin(),candidates.end());
        recursiveSum(0,target,candidates,result,curr);
        return result;
    }

//subset-II
Given an integer array nums that may contain duplicates, return all possible subsets (the power set).
The solution set must not contain duplicate subsets. Return the solution in any order.
Optimal:void recurSubset(int ind,vector<int>& nums,vector<vector<int>>& result,vector<int> curr)    {
        result.push_back(curr);
        for(int i=ind;i<nums.size();i++){
            if(i!=ind && nums[i]==nums[i-1])continue;
            curr.push_back(nums[i]);
            recurSubset(i+1,nums,result,curr);
            curr.pop_back();
        }
    }
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> curr;
        sort(nums.begin(),nums.end());
        recurSubset(0,nums,result,curr);
        return result;
    }

//Combination Sum-III
Find all valid combinations of k numbers that sum up to n such that the following conditions are true:
1.Only numbers 1 through 9 are used. 2.Each number is used at most once.
Return a list of all possible valid combinations. The list must not contain the same combination twice, and the combinations may be returned in any order.
Optimal:
void  recursiveSum(int k,int n,int ind,vector<vector<int>> &result,vector<int> &curr){
        if(k==0){
            if(n==0){
                result.push_back(curr);
            }
            return;
        }
        for(int i=ind;i<=9;i++){
            curr.push_back(i);
            recursiveSum(k-1,n-i,i+1,result,curr);
            curr.pop_back();
        }
    }

//17. Letter Combinations of a Phone Number
Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.
A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.
Optimal:    void recurseString(int ind,string &digits,vector<string>&result,vector<string> &mapping,string curr) {
        if(ind==digits.size())
            {
                result.push_back(curr);
                return;
            }
        for(int i=0;i<mapping[digits[ind]-2-48].length();i++){
            recurseString(ind+1,digits,result,mapping,curr+mapping[digits[ind]-2-48][i]);
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        vector<string> result;
        vector<string> mapping={"abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
        recurseString(0,digits,result,mapping,"");
        return result;
    }

//Trying out all Combos/Hard------------------------------------------------------------------------------------------------------------------

//Palindrome partitioning
Give a string find the minimum number of partitions we need to make so all the partitions are palindrome.(for any given string of length n , n-1 partitions give all palindromes.)
Approach:For this type of question we need front partition:
ex: bababcbadcede
Iteration steps: 1> at b,b is palindrome so can do partition and find solution in (ababcbadcede)
2.> at a,ba not pldr so cannot do a partition here
3.> at b,bab is pldr so find solution in (abcbadcede)
also,
Rules of writing a Recurrence:*********************
1.Express everything in terms of Index
2.Express all possibilities
3.Take the min of all possibilities
4.Write the base case

With memoization, we use up auxiliary space to store minCost at each index.
So we use tabulation:
Rules:1>Write the base case: dp[n]=0
2> start from index  n-1 ->1
3>copy the recurrence

//Word Search
Given an m x n grid of characters board and a string word, return true if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
>bool dfs(int i,int j,int ind,vector<vector<char>>& board, string word)
    {
        if(ind==word.size())return true;
        if(i<0||j<0||i>=board.size()||j>=board[0].size()||board[i][j]!=word[ind])return false;
        char temp=board[i][j];
        board[i][j]='#';
        bool ans=dfs(i-1,j,ind+1,board,word)||
                dfs(i+1,j,ind+1,board,word)||
                dfs(i,j-1,ind+1,board,word)||
                dfs(i,j+1,ind+1,board,word);
        board[i][j] =temp;
        return ans;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        int rows=board.size();
        int cols=board[0].size();
        bool flag=false;
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                bool flag=dfs(i,j,0,board,word);
                if(flag)
                    return flag;
            }
        }
        return false;
    }

//n-queens******************
The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.
Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.
Each solution contains a distinct board configuration of the n-queens'' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.
Optimal:
   bool isAvailable(int i,int j,int n,vector<int> &lowerDiagonal,vector<int> &upperDiagonal,vector<int> &row){
        if(!row[i] && !lowerDiagonal[i+j] && !upperDiagonal[n-1+(j-i)])return true;
        else return false;
    }
private:
    void recurseQueens(int col,int n,vector<vector<string>> &result,vector<string> &curr,vector<int> &lowerDiagonal,vector<int> &upperDiagonal,vector<int> &row){
        if(col==n){
            result.push_back(curr);
            return;
        }
            for(int j=0;j<n;j++){
                if(isAvailable(j,col,n,lowerDiagonal,upperDiagonal,row)){
                 curr[j][col]='Q';
                 lowerDiagonal[j+col]+=1;
                 upperDiagonal[n-1+(col-j)]+=1;
                 row[j]+=1;
                 recurseQueens(col+1,n,result,curr,lowerDiagonal,upperDiagonal,row);
                 curr[j][col]='.';
                 lowerDiagonal[j+col]-=1;
                 upperDiagonal[n-1+(col-j)]-=1;
                 row[j]-=1;
                }
            }
            // cout<<endl;
    }
public:
    vector<vector<string>> solveNQueens(int n) {
         vector<vector<string>> result;
        vector<string> curr(n,"");
        string s(n,'.');
        for(int i=0;i<n;i++){
            curr[i]+=s;
        }
        vector<int> lowerDiagonal(2*n-1,0);
        vector<int> upperDiagonal(2*n-1,0);
        vector<int> row(n,0);
        recurseQueens(0,n,result,curr,lowerDiagonal,upperDiagonal,row);
        return result;
    }
};

//Rat in a Maze
Given a grid of dimensions n x n. A rat is placed at coordinates (0, 0) and wants to reach at coordinates (n-1, n-1). Find all possible paths that rat can take to travel from (0, 0) to (n-1, n-1). The directions in which rat can move are 'U' (up) , 'D' (down) , 'L' (left) , 'R' (right).
The value 0 in grid denotes that the cell is blocked and rat cannot use that cell for travelling, whereas value 1 represents that rat can travel through the cell. If the cell (0, 0) has 0 value, then mouse cannot move to any other cell.
optimal:
bool isSafe(int x, int y, int n, vector<vector<int>> &maze,
                vector<vector<int>> &visited) {
        return (x >= 0 && x < n && y >= 0 && y < n &&
                maze[x][y] == 1 && visited[x][y] == 0);
    }

    // Function to solve maze using backtracking
    void solve(int x, int y, int n, vector<vector<int>> &maze,
               vector<vector<int>> &visited, string path,
               vector<string> &res) {
                //using the direction matrix below can be reduced to 1 if condition
        // If destination reached, store the path
        if (x == n - 1 && y == n - 1) {
            res.push_back(path);
            return;
        }

        // Mark the cell visited
        visited[x][y] = 1;

        // Try moving Down
        if (isSafe(x + 1, y, n, maze, visited)) {
            solve(x + 1, y, n, maze, visited, path + "D", res);
        }
        // Try moving Left
        if (isSafe(x, y - 1, n, maze, visited)) {
            solve(x, y - 1, n, maze, visited, path + "L", res);
        }
        // Try moving Right
        if (isSafe(x, y + 1, n, maze, visited)) {
            solve(x, y + 1, n, maze, visited, path + "R", res);
        }
        // Try moving Up
        if (isSafe(x - 1, y, n, maze, visited)) {
            solve(x - 1, y, n, maze, visited, path + "U", res);
        }

        // Backtrack: unmark cell as visited
        visited[x][y] = 0;
    }

    // Main function to find all paths
    vector<string> findPath(vector<vector<int>> &maze, int n) {
        vector<string> res;
        vector<vector<int>> visited(n, vector<int>(n, 0));
        int di[]={+1,0,0,-1};//direction matrix
        int dj[]={0,-1,+1,0};
        if (maze[0][0] == 1) {
            solve(0, 0, n, maze, visited, "", res,di,dj);
        }
        return res;
    }

//Sudoku Solver
OPtimal:class Solution {
private:
    bool isOk(int row,int col,char ch,vector<vector<char>>& board)    {
        for(int i=0;i<9;i++){
            if(board[row][i]==ch)return false;
            if(board[i][col]==ch)return false;
            if(board[3*(row/3)+i/3][3*(col/3)+i%3]==ch)return false;
        }
        return true;
    }
public:
    void solveSudoku(vector<vector<char>>& board) {
        solve(board);
    }
    bool solve(vector<vector<char>>& board){
        for(int i=0;i<board.size();i++){
            for(int j=0;j<board[i].size();j++){
                if(board[i][j]=='.'){
                    for(char ch='1';ch<='9';ch++){
                        if(isOk(i,j,ch,board)){
                            board[i][j]=ch;
                            if(solve(board))
                                return true;
                            else board[i][j]='.';
                        }
                    }
                return false;
                }
            }
        }
        return true;
    }
};

//Expression Add Operators***********************************************
Given a string num that contains only digits and an integer target, return all possibilities to insert the binary operators '+', '-', and/or '*' between the digits of num so that the resultant expression evaluates to the target value.
Note that operands in the returned expressions should not contain leading zeros.
Note that a number can contain multiple digits.
Optimal: void dfs(string num,int target,int start,long long current_val,long long last_operand,string expression,vector<string> &result) {
        if(start==num.size()){
            // cout<<target<<" "<<current_val<<endl;
            if(target==current_val)
                result.push_back(expression);
            return;
        }
        for(int i=start;i<num.length();i++){
            if(i>start && num[start]=='0')return;
            string current_num=num.substr(start,i-start+1);
            long long current_num_val=stoll(current_num);
            if(start==0){
                dfs(num,target,i+1,current_num_val,current_num_val,current_num,result);
            }
            else{
                dfs(num,target,i+1,current_val+current_num_val,current_num_val,expression+"+"+current_num,result);
                dfs(num,target,i+1,current_val-current_num_val,-current_num_val,expression+"-"+current_num,result);
                dfs(num,target,i+1,current_val-last_operand+last_operand*current_num_val,last_operand*current_num_val,expression+"*"+current_num,result);
            }
        }
    }
public:
    vector<string> addOperators(string num, int target) {
        vector<string> result;
        dfs(num,target,0,0,0,"",result);
        return result;
    }
};

//BIT MANIPULATION ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
>
//Introduction to Bit Manipulation
Binary Number Conversion
Decimal to Binary Conversion:
By repeatedly dividing a number by 2 and recording the result, decimal values can be transformed into binary.

Example: Converting 13 to its binary equivalent:

Start with the decimal number 13.
Divide the number by 2 and record the remainder.
Repeat the division with the quotient until the number becomes 0.
13 / 2 = 6 remainder 1
6 / 2 = 3 remainder 0
3 / 2 = 1 remainder 1
1 / 2 = 0 remainder 1
To obtain the binary equivalent of 13, read the remainders from bottom to top: 1101.

So, the binary equivalent of 13 is 1101.

Binary to Decimal Conversion:
Converting a binary number back to its decimal equivalent involves a reverse process.

Example: Converting 1101 to its decimal equivalent:

Start from the rightmost bit (least significant bit).
Each bit is multiplied by 2 raised to the power of its position index.
1 * 2^0 = 1
0 * 2^1 = 0
1 * 2^2 = 4
1 * 2^3 = 8
Sum = 1 + 0 + 4 + 8 = 13.

Hence, the decimal equivalent of the binary number 1101 is 13.

Understanding One's Complement and Two's Complement
One's Complement
The one's complement of a binary number is obtained by flipping all the bits.

Example: The one's complement of 13 (binary 1101):

Binary of 13     : 0000 1101
One's Complement : 1111 0010
Two's Complement
The two's complement is obtained by taking the one's complement of a number and adding 1.

Example: The two's complement of 13 (binary 1101):

One's Complement : 1111 0010
Add 1            : 1111 0011
Bitwise Operators
AND Operator (&)
If both corresponding bits are 1, the resulting bit is 1; otherwise, it is 0.

13: 1101
 7: 0111
&  : 0101 → 5
OR Operator (|)
If either corresponding bit is 1, the resulting bit is 1.

13: 1101
 7: 0111
|  : 1111 → 15
XOR Operator (^)
If bits differ, the result is 1; if the same, result is 0.

13: 1101
 7: 0111
^  : 1010 → 10
NOT Operator (~)
Flips all bits of the number.

 5: 0000 0101
~5: 1111 1010 → -6 (in two''s complement)
Shift Operators
Right Shift (>>): Shifts bits to the right, fills left with 0s.

13 >> 1 = 0110 → 6
Left Shift (<<): Shifts bits to the left, fills right with 0s.

13 << 1 = 11010 → 26


//Swap two numbers
a=a^b (xor)
b=a^b  ((a^b)^b=a)
a=a^b ((a^b)^b=b)

//check if ith bit is set or not
    //using left shift
    if(N&(1<<i)!=0) bit is set else bit not set

    //using Right shift
    if((N>>i)&1==0)not set else  set

//Set the ith bit
N|(1<<i)

//clear the ith bit
N&~(1<<i)

//Toggle the ith bit
N^(1<<i)
//Remove the last set bit(rightmost)
N&(N-1) (ex: 16(10000) 15(01111))
//check if a number is power of 2
if(N&N-1==0)
//count the number of set bits
int countsetbits(int n){
    int cnt=0;
    while(n>1){
        if(n%2==1) cnt+=1; (if(N&1==1)cnt+=1;)
        n=n/2;
    }
    if(n==1)cnt+=1;
    return cnt;
}
Optimal:
int countsetbits(int n){
    int cnt=0;
    while(n>1){
        cnt+=n&1;
        n=n>>1;
    }
    cnt+=n&1 ;
    return cnt;
}
or
while(N!=0){
    N=N&(N-2); //we are clearing the rightmost bit
    CNT++;
}

//divide two integers without multiplication or division
int divide(int dividend, int divisor) {
        if(dividend==divisor)return 1;
        bool sign=false;
        if(dividend<0&&divisor>=0)sign=true;
        if(dividend>=0&&divisor<0)sign=true;
        long n=abs((long)dividend);
        long d=abs((long)divisor);
        long ans=0;
        while(n>=d){
            int cnt=0;
            while(n>=(d<<(cnt+1)))
                cnt++;
            ans+=1<<cnt;
            n=n-(d<<cnt);
        }
        cout<<ans<<" "<<(1<<31)<<sign;
        if(ans>INT_MAX && sign)return INT_MIN;
        if((ans>INT_MAX||ans==INT_MIN) && !sign)return INT_MAX;

        return sign?-ans:ans;

    }

//Minimum Bit Flips to Convert Number
A bit flip of a number x is choosing a bit in the binary representation of x and flipping it from either 0 to 1 or 1 to 0.
OPtimal:  int countSetBits(int n){
        int cnt=0;
        while(n>1){
            cnt+=n&1;
            n=n>>1;
        }
        if(n&1)cnt+=n&1;
        return cnt;
    }
    int minBitFlips(int start, int goal) {
        return countSetBits(start^goal);
    }
//power set using bit manipulation
Optimal:    vector<vector<int>> subsets(vector<int>& nums) {
         int n = nums.size();
        int subsetCount=1<<n;
        vector<vector<int>> result;
        result.reserve(subsetCount);
        for(int i=0;i<subsetCount;i++){
            vector<int> temp;
             temp.reserve(n);
            for(int j=0;j<n;j++)
                if(i&(1<<j))temp.push_back(nums[j]);
            result.push_back(temp);
        }
        return result;
    }
};

//XOR of number in a Given Range
00001
00010
00011

N   value
1    1
2    3
3    0
4    4
5    1
6    7
7    0
8    8            ANS
Answer: N%4==1    1
        N%4==2    N+1
        N%4==3    0
        N%4==0    N
Also for XOR from L to R: find till L-1 and till R and xor both (the repeated part will become 0)

//Single Number -III (Bit Manipulation)
Every number will appear twice except two distinct numbers which will appear once
 Optimal:Xor all -> we get the bit poistions where the two distinct differ,take the rightmost set bit if this (num&num-1)^num
 then loop through the numbers and divide the numbers in two buckets based on value at that calculated bit position (keep xoring in the buckets ) and finally at end the buckets have the two numbers remaining
 -->also we need to take long for the xor of all elements given

//Bit Manipulatin -math Problems ----------------------------------------------------------------
//Print all prime factors of a number
Optimal:
for(i=2->sqrt(n)){
    if(n%i==0){
        list.add(i);
        while(n%i==0)
            n=n/i;

    }
}
if(n!=1)list.add(n);
Time:O(sqrt(N)*logN)

//Sieve of Eratosthenes
Given a number N, print all primes till N
std::vector<int> primesInRange(std::vector<std::vector<int>>& queries) {
        if (queries.empty()) {
            return {};
        }

        // Find the maximum value in the queries
        // to determine the sieve range
        int maxVal = 0;
        for (const auto& query : queries) {
            maxVal = std::max(maxVal, query[1]);
        }

        // Step 1: Use the Sieve of Eratosthenes
        // to find all primes up to maxVal
        std::vector<bool> isPrime(maxVal + 1, true);
        isPrime[0] = isPrime[1] = false;  // 0 and 1 are not primes
        for (int p = 2; p * p <= maxVal; ++p) {
            if (isPrime[p]) {
                for (int i = p * p; i <= maxVal; i += p) {
                    isPrime[i] = false;
                }
            }
        }

        // Step 2: Create a prefix sum array
        // to count primes up to each number
        std::vector<int> primeCount(maxVal + 1, 0);
        for (int i = 1; i <= maxVal; ++i) {
            primeCount[i] = primeCount[i - 1];
            if (isPrime[i]) {
                primeCount[i]++;
            }
        }

        // Step 3: Process each query to find the number of primes
        // in the given range
        std::vector<int> result;
        for (const auto& query : queries) {
            int start = query[0];
            int end = query[1];
            if (start == 0) {
                result.push_back(primeCount[end]);
            } else {
                result.push_back(primeCount[end] - primeCount[start - 1]);
            }
        }

        return result;

//Stack and Queues-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.Learning
//Stack & Queues -Implement using Arrays,LL,Each other
//Implement Stack and Queues using arraysl ->not dynamic O(1) all operations
//Implement using LL->dynamic and O(1) all operations
Stack:Keep the head at top
Queue: Keep the head at start and end will point to last node

//Implemnet Stack using Queue--(Using 1 Queue we can do)
// Stack implementation using Queue
class QueueStack {
    // Queue
    queue<int> q;

public:
    // Method to push element in the stack
    void push(int x) {
        // Get size
        int s = q.size();
        // Add element
        q.push(x);

        // Move elements before new element to back
        for (int i = 0; i < s; i++) {
            q.push(q.front());
            q.pop();
        }
    }

    // Method to pop element from stack
    int pop() {
        // Get front element
        int n = q.front();
        // Remove front element
        q.pop();
        // Return removed element
        return n;
    }

    // Method to return the top of stack
    int top() {
        // Return front element
        return q.front();
    }

    // Method to check if the stack is empty
    bool isEmpty() {
        return q.empty();
    }

//Implement Queue using stack--Require two stack
for push : push all in other stack and then push and then repush the original elements, so at top we have the tail element

// Queue implementation using stack
Using Two Stacks Where Push Operation is O(N)
class StackQueue {
private:
    stack <int> st1, st2;

public:
    // Empty Constructor
    StackQueue () {

    }

    // Method to push elements in the queue
    void push(int x) {
        /* Pop out elements from the first stack
        and push on top of the second stack */
        while (!st1.empty()) {
            st2.push(st1.top());
            st1.pop();
        }

        // Insert the desired element
        st1.push(x);

        /* Pop out elements from the second stack
        and push back on top of the first stack */
        while (!st2.empty()) {
            st1.push(st2.top());
            st2.pop();
        }
    }

    // Method to pop element from the queue
    int pop() {
        // Edge case
        if (st1.empty()) {
            cout << "Stack is empty";
            return -1; // Representing empty stack
        }

        // Get the top element
        int topElement = st1.top();
        st1.pop(); // Perform the pop operation

        return topElement; // Return the popped value
    }

    // Method to get the front element from the queue
    int peek() {
        // Edge case
        if (st1.empty()) {
            cout << "Stack is empty";
            return -1; // Representing empty stack
        }

        // Return the top element
        return st1.top();
    }

    // Method to find whether the queue is empty
    bool isEmpty() {
        return st1.empty();
    }
};

//Using Two Stacks Where Push Operation is O(1)
class StackQueue {
  public:
    stack<int> input, output;

    // Initialize your data structure here
    StackQueue() {}

    // Push element x to the back of queue
    void push(int x) {
        input.push(x);
    }

    // Removes the element from in front of queue and returns that element
    int pop() {
        // Shift input to output if output is empty
        if (output.empty()) {
            while (!input.empty()) {
                output.push(input.top());
                input.pop();
            }
        }

        // If queue is still empty, return -1 (or throw an error if preferred)
        if (output.empty()) {
            cout << "Queue is empty, cannot pop." << endl;
            return -1;
        }

        int x = output.top();
        output.pop();
        return x;
    }

    // Get the front element
    int peek() {
        // Shift input to output if output is empty
        if (output.empty()) {
            while (!input.empty()) {
                output.push(input.top());
                input.pop();
            }
        }

        // If queue is still empty, return -1 (or throw an error if preferred)
        if (output.empty()) {
            cout << "Queue is empty, cannot peek." << endl;
            return -1;
        }

        return output.top();
    }

    // Returns true if the queue is empty, false otherwise
    bool isEmpty() {
        return input.empty() && output.empty();
    }
};

//Prefix, Infix, and Postfix Conversion-------------------------------------------------------------

OPerators:    ^    (priority |   )
             * /            \|/
             + -
Operands: a-z, A-Z and 0-9

// Function to return precedence of operators
int prec(char c) {
    if (c == '^')  // Exponent operator has highest precedence
        return 3;
    else if (c == '/' || c == '*')  // Multiplication and division have higher precedence than addition
        return 2;
    else if (c == '+' || c == '-')  // Addition and subtraction have lowest precedence
        return 1;
    else
        return -1;
}
//Infix to Postfix

// The main function to convert infix expression to postfix expression
void infixToPostfix(string s) {
    stack<char> st; // Stack to hold operators and parentheses
    string result;  // String to hold the resulting postfix expression

    for (int i = 0; i < s.length(); i++) {
        char c = s[i];

        // If the scanned character is an operand, add it to the result string
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'))
            result += c;

        // If the scanned character is an ‘(‘, push it to the stack
        else if (c == '(')
            st.push('(');

        // If the scanned character is a ‘)’, pop from stack until an ‘(‘ is encountered
        else if (c == ')') {
            while (st.top() != '(') {
                result += st.top();
                st.pop();
            }
            st.pop();  // Pop the ‘(‘ from the stack
        }

        // If an operator is scanned
        else {
            while (!st.empty() && prec(s[i]) <= prec(st.top())) {
                result += st.top();
                st.pop();
            }
            st.push(c);  // Push the current operator to the stack
        }
    }

    // Pop all the remaining elements from the stack
    while (!st.empty()) {
        result += st.top();
        st.pop();
    }

    cout << "Postfix expression: " << result << endl;  // Output the result
}

//Prefix to infix
// Function to convert prefix to infix
string prefixToInfix(string prefix) {
    stack<string> s;
    int n = prefix.size();

    // Traverse the prefix expression from right to left
    for (int i = n - 1; i >= 0; i--) {
        char c = prefix[i];

        // If the character is an operand, push it to the stack
        if (isalnum(c)) {
            s.push(string(1, c));
        } else {
            // Pop two operands from the stack
            string op1 = s.top(); s.pop();
            string op2 = s.top(); s.pop();

            // Form the new infix expression and push back to stack
            s.push("(" + op1 + c + op2 + ")");
        }
    }

    // The final element in the stack is the result
    return s.top();
}

// prefix to postfix
// Function to convert prefix to postfix
string prefixToPostfix(string prefix) {
    stack<string> s;
    int n = prefix.size();

    // Traverse the prefix expression from right to left
    for (int i = n - 1; i >= 0; i--) {
        char c = prefix[i];

        // If the character is an operand, push it to the stack
        if (isalnum(c)) {
            s.push(string(1, c));
        } else {
            // Pop two operands from the stack
            string op1 = s.top(); s.pop();
            string op2 = s.top(); s.pop();

            // Form the new postfix expression and push back to stack
            s.push(op1 + op2 + c);
        }
    }

    // The final element in the stack is the result
    return s.top();
}

//// Function to convert postfix to prefix
string postfixToPrefix(string postfix) {
    stack<string> s;
    int n = postfix.size();

    // Traverse the postfix expression from left to right
    for (int i = 0; i < n; i++) {
        char c = postfix[i];

        // If the character is an operand, push it to the stack
        if (isalnum(c)) {
            s.push(string(1, c));
        } else {
            // Pop two operands from the stack
            string op2 = s.top(); s.pop();
            string op1 = s.top(); s.pop();

            // Form the new prefix expression and push back to stack
            s.push(c + op1 + op2);
        }
    }

    // The final element in the stack is the result
    return s.top();
}

//// Function to convert postfix to infix
string postfixToInfix(string postfix) {
    stack<string> s;
    int n = postfix.size();

    // Traverse the postfix expression from left to right
    for (int i = 0; i < n; i++) {
        char c = postfix[i];

        // If the character is an operand, push it to the stack
        if (isalnum(c)) {
            s.push(string(1, c));
        } else {
            // Pop two operands from the stack
            string op2 = s.top(); s.pop();
            string op1 = s.top(); s.pop();

            // Form the new infix expression and push back to stack
            s.push("(" + op1 + c + op2 + ")");
        }
    }

    // The final element in the stack is the result
    return s.top();
}

//Infix to Prefix
// Function to check if a character is an operator
bool isOperator(char c) {
    return (!isalpha(c) && !isdigit(c));  // If the character is neither alphabetic nor numeric, it's an operator
}

// Function to return the precedence of operators
int getPriority(char C) {
    if (C == '-' || C == '+')  // Addition and subtraction have lowest precedence
        return 1;
    else if (C == '*' || C == '/')  // Multiplication and division have higher precedence
        return 2;
    else if (C == '^')  // Exponent operator has highest precedence
        return 3;
    return 0;
}

// Function to convert infix expression to postfix expression
string infixToPostfix(string infix) {
    infix = '(' + infix + ')';  // Add parentheses to handle edge cases
    int l = infix.size();
    stack<char> char_stack;  // Stack to store operators
    string output;  // String to store the resulting postfix expression

    for (int i = 0; i < l; i++) {

        // If the scanned character is an operand, add it to output
        if (isalpha(infix[i]) || isdigit(infix[i]))
            output += infix[i];

        // If the scanned character is ‘(’, push it to the stack
        else if (infix[i] == '(')
            char_stack.push('(');

        // If the scanned character is ‘)’, pop and output from the stack until an ‘(‘ is encountered
        else if (infix[i] == ')') {
            while (char_stack.top() != '(') {
                output += char_stack.top();
                char_stack.pop();
            }
            char_stack.pop();  // Remove '(' from the stack
        }

        // If an operator is found
        else {
            if (isOperator(char_stack.top())) {
                if (infix[i] == '^') {
                    while (getPriority(infix[i]) <= getPriority(char_stack.top())) {
                        output += char_stack.top();
                        char_stack.pop();
                    }
                } else {
                    while (getPriority(infix[i]) < getPriority(char_stack.top())) {
                        output += char_stack.top();
                        char_stack.pop();
                    }
                }
                // Push current operator on stack
                char_stack.push(infix[i]);
            }
        }
    }

    // Pop all remaining elements from the stack
    while (!char_stack.empty()) {
        output += char_stack.top();
        char_stack.pop();
    }
    return output;  // Return the postfix expression
}

// Function to convert infix expression to prefix expression
string infixToPrefix(string infix) {
    int l = infix.size();

    // Reverse the infix expression
    reverse(infix.begin(), infix.end());

    // Replace '(' with ')' and vice versa
    for (int i = 0; i < l; i++) {
        if (infix[i] == '(') {
            infix[i] = ')';
            i++;
        } else if (infix[i] == ')') {
            infix[i] = '(';
            i++;
        }
    }

    string prefix = infixToPostfix(infix);  // Convert the modified infix to postfix

    // Reverse the postfix expression to get the prefix
    reverse(prefix.begin(), prefix.end());

    return prefix;  // Return the prefix expression
}

//mONOTONIC sTACK/Queue problems VIP problems--------------------------------------------------------------------------------------------------------------------------------------------------
Monotonic Stack: elements in a given order
//next greater element
Given an integer array A, return the next greater element for every element in A. The next greater element for an element x is the first element greater than x that we come across while traversing the array in a clockwise manner. If it doesn''t exist, return -1 for this element.

 vector<int> nextGreater(vector<int>& nums) {
        // Stack to store elements
        stack<int> st;

        // Result array of same size
        int n = nums.size();
        vector<int> res(n);

        // Traverse from right to left
        for (int i = n - 1; i >= 0; i--) {

            // Pop all smaller or equal elements
            while (!st.empty() && st.top() <= nums[i]) {
                st.pop();
            }

            // If stack is empty, no greater element
            if (st.empty()) res[i] = -1;

            // Else top of stack is the answer
            else res[i] = st.top();

            // Push current element
            st.push(nums[i]);
        }

        // Return the result
        return res;
    }

//next greater element-II
 Given a circular integer array arr, return the next greater element for every element in arr.
The next greater element for an element x is the first element greater than x that we come across while traversing the array in a clockwise manner.
If it doesn''t exist, return -1 for that element element.
Optimal:
vector<int> nextGreaterElements(vector<int>& nums) {

        int n=nums.size();
        vector<int> ans(n,0);
        stack<int> st;
        for(int i=2*n-1;i>=0;i--){
            while(!st.empty()&&st.top()<=nums[i%n])st.pop();
            if(i/n==0){
                ans[i]=st.empty()?-1:st.top();
            }
            st.push(nums[i%n]);
        }
        return ans;
    }

//Trapping Rain Water************
Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining
OPtimal:Time O(n) and space :O(1)
int trap(vector<int>& height) {
        // stack<int> st;
        int n=height.size();
        int maxRight=INT_MIN;
        int maxLeft=INT_MIN;
        int left=0,right=n-1,water=0;
        while(left<right){
            if(height[left]<height[right]){
                if(maxLeft>height[left])
                    water+=maxLeft-height[left];
                else maxLeft=height[left];
                left++;
            }
            else{
                if(maxRight>height[right])
                    water+=maxRight-height[right];
                else maxRight=height[right];
                right--;
            }
        }
        return water;
    }

//Sum of Subarray Minimums
Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. Since the answer may be large, return the answer modulo 109 + 7.
Optimal:int sumSubarrayMins(vector<int>& arr) {
        int n=arr.size();
        vector<int> nse(n);
        stack<int> st;
        for(int i=n-1;i>=0;i--){
            while(!st.empty()&&arr[i]<=arr[st.top()])st.pop();
            nse[i]=st.empty()?n:st.top();
            st.push(i);
        }
        // delete(st);
        stack<int> st1;
        vector<int> pse(n);
        for(int i=0;i<n;i++){
            while(!st1.empty()&&arr[i]<arr[st1.top()])st1.pop();
            pse[i]=st1.empty()?-1:st1.top();
            st1.push(i);
        }
        int ans=0;
        long mod=1e9+7;
        for(int i=0;i<n;i++){
            long left = (nse[i] - i);
            long right = (i - pse[i]);
            long val = arr[i];
            long long product = (left * right) % mod;
            product = (product * val) % mod;

            ans = (ans + product) % mod;
        }
        return ans;

// Asteroid Collision
We are given an array asteroids of integers representing asteroids in a row. The indices of the asteroid in the array represent their relative position in space.
For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.
Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.
Optimal:vector<int> asteroidCollision(vector<int>& ass) {
        vector<int> st;
        int top=-1;
        int n=ass.size();
        for(int i=0;i<n;i++){
            if(ass[i]>0){st.push_back(ass[i]);top++;}
            else {
                  while(top!=-1&&st[top]>0&& st[top]<abs(ass[i]))
                    {st.erase(st.begin() + top);top--;}
                if(top!=-1&&st[top]==abs(ass[i])){st.erase(st.begin() + top);top--;}
                else if(top==-1|| st[top]<0){st.push_back(ass[i]);top++;};
            }
        }

        return st;
    }

//Largest Rectangle in Histogram
Given an array of integers heights representing the histogram''s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.
Optimal: int largestRectangleAre(vector<int>& high) {
        stack<int> st;
        int n=high.size();int maxArea=INT_MIN;
        for(int i=0;i<n;i++){
            while(!st.empty()&&high[st.top()]>high[i]){
                int element=high[st.top()];
                st.pop();
                int ind=st.empty()?-1:st.top();
                maxArea=max(maxArea,element*(i-ind-1));
            }
            st.push(i);
        }
        while(!st.empty()){
            int element=high[st.top()];
            st.pop();
            int ind=st.empty()?-1:st.top();
            maxArea=max(maxArea,element*(n-ind-1));
        }
        return maxArea;
    }

//Sliding Window Maximum
//We will use monotonic stack(decreasing) to keep track of window elements--> We also need to remove elements in FIFO manner , so we use deque as it could facilitate both.
optimal: vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        int n=nums.size();
        for(int i=0;i<n;i++){
            if(!dq.empty()&&dq.front()<=i-k)
             dq.pop_front();
            while(!dq.empty()&&nums[dq.back()]<=nums[i])
                dq.pop_back();
            dq.push_back(i);
            if(i>=k-1)result.push_back(nums[dq.front()]);
        }
        return result;
    }
//Stock span problem
Problem Statement: Given an array arr of size n, where each element arr[i] represents the stock price on day i. Calculate the span of stock prices for each day.
The span Sᵢ for a specific day i is defined as the maximum number of consecutive previous days (including the current day) for which the stock price was less than or equal to the price on day i.
Optimal:class StockSpanner {
    stack<pair<int,int>> st;
    int ind;
public:
    StockSpanner() {
        ind=-1;
    }

    int next(int price) {
        ind++;
        while(!st.empty()&&(st.top()).first<=price)st.pop();
        // int ans=1;
        int ans=ind-(st.empty()?-1:st.top().second);
        st.push({price,ind});
        return ans;
    }
};

//Celebrity Problem
Problem Statement: A celebrity is a person who is known by everyone else at the party but does not know anyone in return. Given a square matrix M of size N x N where M[i][j] is 1 if person i knows person j, and 0 otherwise, determine if there is a celebrity at the party. Return the index of the celebrity or -1 if no such person exists.
Note that M[i][i] is always 0.
Optimal:Initialize two pointers, one at the top (start) and one at the bottom (end) of the matrix
Compare the individuals at the top and bottom pointers
If the person at the top pointer knows the person at the bottom pointer, move the top pointer down (the top person cannot be the celebrity)
If the person at the bottom pointer knows the person at the top pointer, move the bottom pointer up (the bottom person cannot be the celebrity)
If neither knows the other, increment both pointers (neither can be the celebrity)
After the traversal, the remaining candidate at the top pointer is the potential celebrity
Check if the candidate is a valid celebrity by ensuring that everyone knows this person and this person knows no one
If the candidate is valid, return the index; otherwise, return -1 indicating no celebrity

//LFU Cache
Problem Statement: Design and implement a data structure for a Least Frequently Used (LFU) cache.
Implement the LFUCache class with the following functions:
LFUCache(int capacity): Initialize the object with the specified capacity.
int get(int key): Retrieve the value of the key if it exists in the cache; otherwise, return -1.
void put(int key, int value): Update the value of the key if it is present in the cache, or insert the key if it is not already present. If the cache has reached its capacity, invalidate and remove the least frequently used key before inserting a new item. In case of a tie (i.e., two or more keys with the same frequency), invalidate the least recently used key.
A use counter is maintained for each key in the cache to determine the least frequently used key. The key with the smallest use counter is considered the least frequently used.
When a key is first inserted into the cache, its use counter is set to 1 due to the put operation. The use counter for a key in the cache is incremented whenever a get or put operation is called on it. Ensure that the functions get and put run in O(1) average time complexity.
Optimal:#include <bits/stdc++.h>
using namespace std;

/* To implement a node in doubly linked
list that will store data items */
struct Node {
   int key, value, cnt;
   Node *next;
   Node *prev;
   Node(int _key, int _value) {
       key = _key;
       value = _value;
       cnt = 1;
   }
};

// To implement the doubly linked list
struct List {
   int size; // Size
   Node *head; // Dummy head
   Node *tail; // Dummy tail

   // Constructor
   List() {
       head = new Node(0, 0);
       tail = new Node(0,0);
       head->next = tail;
       tail->prev = head;
       size = 0;
   }

   // Function to add node in front
   void addFront(Node *node) {
       Node* temp = head->next;
       node->next = temp;
       node->prev = head;
       head->next = node;
       temp->prev = node;
       size++;
   }

   // Function to remove node from the list
   void removeNode(Node* delnode) {
       Node* prevNode = delnode->prev;
       Node* nextNode = delnode->next;
       prevNode->next = nextNode;
       nextNode->prev = prevNode;
       size--;
   }
};

// Class to implement LFU cache
class LFUCache {
private:

   // Hashmap to store the key-nodes pairs
   map<int, Node*> keyNode;

   /* Hashmap to maintain the lists
   having different frequencies */
   map<int, List*> freqListMap;

   int maxSizeCache; // Max size of cache

   /* To store the frequency of least
   frequently used data-item */
   int minFreq;

   // To store current size of cache
   int curSize;

public:

   // Constructor
   LFUCache(int capacity) {
       // Set the capacity
       maxSizeCache = capacity;
       minFreq = 0; // Set minimum frequency
       curSize = 0; // Set current frequency
   }

   // Method to update frequency of data-items
   void updateFreqListMap(Node *node) {

       // Remove from Hashmap
       keyNode.erase(node->key);

       // Update the frequency list hashmap
       freqListMap[node->cnt]->removeNode(node);

       // If node was the last node having it's frequency
       if(node->cnt == minFreq &&
          freqListMap[node->cnt]->size == 0) {

           // Update the minimum frequency
           minFreq++;
       }

       // Creating a dummy list for next higher frequency
       List* nextHigherFreqList = new List();

       // If the next higher frequency list already exists
       if(freqListMap.find(node->cnt + 1) !=
          freqListMap.end()) {

           // Update pointer to already existing list
           nextHigherFreqList = freqListMap[node->cnt + 1];
       }

       // Increment the count of data-item
       node->cnt += 1;

       // Add the node in front of higher frequency list
       nextHigherFreqList->addFront(node);

       // Update the
       freqListMap[node->cnt] = nextHigherFreqList;
       keyNode[node->key] = node;
   }

   // Method to get the value of key from LFU cache
   int get(int key) {

       // Return the value if key exists
       if(keyNode.find(key) != keyNode.end()) {
           Node* node = keyNode[key]; // Get the node
           int val = node->value; // Get the value
           updateFreqListMap(node); // Update the frequency

           // Return the value
           return val;
       }

       // Return -1 if key is not found
       return -1;
   }

   void put(int key, int value) {
       /* If the size of Cache is 0,
       no data-items can be inserted */
       if (maxSizeCache == 0) {
           return;
       }

       // If key already exists
       if(keyNode.find(key) != keyNode.end()) {

           // Get the node
           Node* node = keyNode[key];

           // Update the value
           node->value = value;

           // Update the frequency
           updateFreqListMap(node);
       }

       // Else if the key does not exist
       else {

           // If cache limit is reached
           if(curSize == maxSizeCache) {

               // Remove the least frequently used data-item
               List* list = freqListMap[minFreq];
               keyNode.erase(list->tail->prev->key);

               // Update the frequency map
               freqListMap[minFreq]->removeNode(
                   list->tail->prev
               );

               // Decrement the current size of cache
               curSize--;
           }

           // Increment the current cache size
           curSize++;

           // Adding new value to the cache
           minFreq = 1; // Set its frequency to 1

           // Create a dummy list
           List* listFreq = new List();

           // If the list already exist
           if(freqListMap.find(minFreq) !=
              freqListMap.end()) {

               // Update the pointer to already present list
               listFreq = freqListMap[minFreq];
           }

           // Create the node to store data-item
           Node* node = new Node(key, value);

           // Add the node to dummy list
           listFreq->addFront(node);

           // Add the node to Hashmap
           keyNode[key] = node;

           // Update the frequency list map
           freqListMap[minFreq] = listFreq;
       }
   }
};

int main() {
  // LFU Cache
  LFUCache cache(2);

  // Queries
  cache.put(1, 1);
  cache.put(2, 2);
  cout << cache.get(1) << " ";
  cache.put(3, 3);
  cout << cache.get(2) << " ";
  cout << cache.get(3) << " ";
  cache.put(4, 4);
  cout << cache.get(1) << " ";
  cout << cache.get(3) << " ";
  cout << cache.get(4) << " ";

  return 0;
}

//Two-Pointer Sliding window problems ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Longest Substring without repeating character
Optimal:
int lengthOfLongestSubstring(string s) {
        int n=s.size();
        int maxCount=0;
        int l=0,r=0;
        map<char,int> mp;
        int count=0;
        while(r<n){

            if(mp.find(s[r])==mp.end())
            {
                count=r-l+1;
                mp[s[r]]=r;
                maxCount=max(count,maxCount);
            }
            else {
                if(mp[s[r]]<l){
                    count=r-l+1;
                    mp[s[r]]=r;
                    maxCount=max(count,maxCount);
                }
                else{
                    l=mp[s[r]]+1;
                    mp[s[r]]=r;
                    count=0;
                }
            }
            r++;
        }
        // maxCount=max(count,maxCount);
            return maxCount;
    }

//Max Consecutive Ones III
Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.
Better:Time:O(N+N)
int longestOnes(vector<int>& nums, int k) {
        int l=0,r=0,maxlen=0,zeros=0,n=nums.size();
        int length=0;
        while(r<n){
            if(nums[r]==0)zeros++;
            while(zeros>k){
                if(nums[l]==0)zeros--;
                l++;
            }
            if(zeros<=k){
                length=r-l+1;
                maxlen=max(maxlen,length);
            }
            r++;
        }
        return maxlen;
    }
Optimal:Time: O(N)
Better:Time:O(N+N)
int longestOnes(vector<int>& nums, int k) {
        int l=0,r=0,maxlen=0,zeros=0,n=nums.size();
        int length=0;
        while(r<n){
            if(nums[r]==0)zeros++;
            if(zeros>k){//just changed while to if , so that the l and r move together one step at a time
                if(nums[l]==0)zeros--;
                l++;
            }
            if(zeros<=k){
                length=r-l+1;
                maxlen=max(maxlen,length);
            }
            r++;
        }
        return maxlen;
    }
//Fruit Into Baskets
Problem Statement: There is only one row of fruit trees on the farm, oriented left to right. An integer array called fruits represents the trees, where fruits[i] denotes the kind of fruit produced by the ith tree.
The goal is to gather as much fruit as possible, adhering to the owner''s stringent rules :
There are two baskets available, and each basket can only contain one kind of fruit. The quantity of fruit each basket can contain is unlimited.
Start at any tree, but as you proceed to the right, select exactly one fruit from each tree, including the starting tree. One of the baskets must hold the harvested fruits.
Once reaching a tree with fruit that cannot fit into any basket, stop.
Return the maximum number of fruits that can be picked.
better:similar like above
optimal:similar like above

//930. Binary Subarrays With Sum
Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum goal.
A subarray is a contiguous part of the array.
Optimal:get number of subarrays with sum<=goal, then subtract number of subarrays with sum<=goal-1
int fun(vector<int>& nums, int goal) {
        int count=0,n=nums.size();int l=0,r=0;int sum=0;
        if(goal<0)return 0;
        while(r<n){
            sum+=nums[r];
            while(sum>goal){

                sum-=nums[l];
                l++;

            }
            count+=r-l+1;
            r++;
        }
        return count;
    }
    int numSubarraysWithSum(vector<int>& nums, int goal) {

        return fun(nums,goal)-fun(nums,goal-1);
    }
};

//1248. Count Number of Nice Subarrays
Given an array of integers nums and an integer k. A continuous subarray is called nice if there are k odd numbers on it.
Return the number of nice sub-arrays.
Optimal: same as above

// Number of Substrings Containing All Three Characters
Given a string s consisting only of characters a, b and c.
Return the number of substrings containing at least one occurrence of all these characters a, b and c.
Naive: search all substrings , Time Complexity:O(N2),Space Complexity: O(N)
Optimal:
int numberOfSubstrings(string chars) {
        vector<int> s(3,-1);
        int n=chars.size();
        int ans=0;
        for(int i=0;i<n;i++){
            s[chars[i]-'a']=i;
            if(s[0]!=-1&&s[1]!=-1&&s[2]!=-1){
                ans+=min({s[0],s[1],s[2]})+1;//// Find the minimum using an initializer list
            }
        }
        return ans;
    }

//Maximum Points You Can Obtain from Cards
There are several cards arranged in a row, and each card has an associated number of points. The points are given in the integer array cardPoints.
In one step, you can take one card from the beginning or from the end of the row. You have to take exactly k cards.
Your score is the sum of the points of the cards you have taken.
Given the integer array cardPoints and the integer k, return the maximum score you can obtain.
Optimal:
int maxScore(vector<int>& cardPoints, int k) {
        int lsum=0;
        for(int i=0;i<k;i++)lsum+=cardPoints[i];
        int maxSum=lsum;
        int rind=cardPoints.size()-1;
        for(int i=k-1;i>=0;i--){
            lsum-=cardPoints[i];
            lsum+=cardPoints[rind--];
            maxSum=max(lsum,maxSum);
        }
        return maxSum;

//Longest Substring With At Most K Distinct Characters
Problem Statement: Given a string s and an integer k.Find the length of the longest substring with at most k distinct characters
Optimal:int lengthOfLongestSubstringKDistinct(string s, int k) {
        // Edge case: if k is 0 or string is empty
        if (k == 0 || s.empty()) return 0;

        // Hash map to store frequency of characters in current window
        unordered_map<char, int> freq;

        // Initialize left pointer of sliding window
        int left = 0;

        // Initialize variable to store maximum length
        int maxLen = 0;

        // Loop through the string using right pointer
        for (int right = 0; right < s.length(); right++) {
            // Include current character into frequency map
            freq[s[right]]++;

            // Shrink window if number of distinct characters exceeds k
            while (freq.size() > k) {
                freq[s[left]]--;

                // If character count becomes zero, erase from map
                if (freq[s[left]] == 0) {
                    freq.erase(s[left]);
                }

                // Move left pointer ahead
                left++;
            }

            // Update maxLen with current valid window size
            maxLen = max(maxLen, right - left + 1);
        }

        // Return the final answer
        return maxLen;
    }
};

//Subarray with k different integers
Problem Statement: You are given an integer array nums and an integer k. Return the number of good subarrays of nums.
A good subarray is defined as a contiguous subarray of nums that contains exactly k distinct integers. A subarray is a contiguous part of the array.
Optimal:
    int atMostK(vector<int>& nums, int K) {
        unordered_map<int, int> freq;
        int left = 0, count = 0;
        // Traverse the array with right pointer
        for (int right = 0; right < nums.size(); right++) {
            // If it's a new unique element, decrease K
            if (freq[nums[right]] == 0) {
                K--;
            }
            // Increment frequency of current element
            freq[nums[right]]++;
            // Shrink the window if distinct count > K
            while (K < 0) {
                freq[nums[left]]--;
                if (freq[nums[left]] == 0) {  K++; }
                left++;
            }
            // Count all subarrays ending at current right
            count += (right - left + 1);
        }
        return count;
    }
    // Main function to return number of subarrays with exactly K distinct integers
    int subarraysWithKDistinct(vector<int>& nums, int k) {
        return atMostK(nums, k) - atMostK(nums, k - 1);
    }

// Minimum Window Substring
Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".
The testcases will be generated such that the answer is unique.
Optimal:
string minWindow(string s, string t) {
        int n=s.size(),m=t.size();
        int minLen=INT_MAX,sIndex=-1,cnt=0;
        map<char,int> mp;
        // for(int i=0;i<256;i++)mp[i]=0;
        for(int i=0;i<m;i++)mp[t[i]]++;
        int l=0,r=0;
        while(r<n){
            if(mp[s[r]]>0)cnt++;
            mp[s[r]]--;
            while(cnt==m){
                if(r-l+1<minLen){
                    minLen=r-l+1;
                    sIndex=l;
                }
                mp[s[l]]++;
                if(mp[s[l]]>0)cnt--;
                l++;
            }
            r++;
        }
        if(sIndex==-1)return "";
        return s.substr(sIndex,minLen);
    }

//Minimum Window Subsequence - Solution
We need to find the minimum contiguous substring of s1 such that s2 is a subsequence of that substring. Key points:
s2 must appear in order (subsequence property)
We want the shortest such substring
If multiple windows have the same length, return the leftmost one
Optimal:string minWindow(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    int minLen = INT_MAX, startIndex = -1;
    int i = 0, j = 0;

    while (i < n) {
        // Expand: Find end of window where s2 is a subsequence
        if (s1[i] == s2[j]) {
            j++;
            if (j == m) {
                // Contract: Find the start of minimum window
                int end = i;
                j--;
                while (j >= 0) {
                    if (s1[i] == s2[j]) {
                        j--;
                    }
                    i--;
                }
                i++; // i is now at the start of valid window
                j++; // reset j for next search

                // Update minimum window
                if (end - i + 1 < minLen) {
                    minLen = end - i + 1;
                    startIndex = i;
                }
            }
        }
        i++;
    }

    return (startIndex == -1) ? "" : s1.substr(startIndex, minLen);
}


//Kth largest/smallest element in an array
Problem Statement: Given an array nums, return the kth largest element in the array.

Brute Force:Using Max-Heaps we do k Heap-Max extract .Time: O(n*k)
Optimal: Use Partinioning to get to kth position.
int kthLargestElement(vector<int>& nums, int k) {
        // Return -1, if the Kth largest element does not exist
        if(k > nums.size()) return -1;

        // Pointers to mark the part of working array
        int left = 0, right = nums.size() - 1;

        // Until the Kth largest element is found
        while(true) {
            // Get the pivot index
            int pivotIndex = randomIndex(left, right);

            // Update the pivotIndex
            pivotIndex = partitionAndReturnIndex(nums, pivotIndex, left, right);

            // If Kth largest element is found, return
            if(pivotIndex == k-1) return nums[pivotIndex];

            // Else adjust the end pointers in array
            else if(pivotIndex > k-1) right = pivotIndex - 1;
            else left = pivotIndex + 1;
        }

        return -1;
    }

private:
    // Function to get a random index
    int randomIndex(int &left, int &right) {
        // length of the array
        int len = right - left + 1;

        // Return a random index from the array
        return (rand() % len) + left;
    }

    // Function to perform the partition and return the updated index of pivot
    int partitionAndReturnIndex(vector<int> &nums, int pivotIndex, int left, int right) {
        int pivot = nums[pivotIndex]; // Get the pivot element

        // Swap the pivot with the left element
        swap(nums[left], nums[pivotIndex]);

        int ind = left + 1; // Index to mark the start of right portion

        // Traverse on the array
        for(int i = left + 1; i <= right; i++) {

            // If the current element is greater than the pivot
            if(nums[i] > pivot) {
                // Place the current element in the left portion
                swap(nums[ind], nums[i]);

                // Move the right portion index
                ind++;
            }
        }

        swap(nums[left], nums[ind-1]); // Place the pivot at the correct index

        return ind-1; // Return the index of pivot now
    }
};

//Kth-smallest element in an array
same as above
//Sort K sorted array
Problem Statement: Given an array arr[] and a number k . The array is sorted in a way that every element is at max k distance away from it sorted position. It means if we completely sort the array, then the index of the element can go from i - k to i + k where i is index in the given array. Our task is to completely sort the array.
Optimal:vector<int> sortNearlySortedArray(vector<int>& arr, int k) {
        // Create a min heap using priority_queue with greater comparator
        priority_queue<int, vector<int>, greater<int>> minHeap;

        // Store the final sorted result
        vector<int> result;

        // Push first k+1 elements into the heap
        for (int i = 0; i <= k && i < arr.size(); i++) {
            minHeap.push(arr[i]);
        }

        // Process the remaining elements of the array
        for (int i = k + 1; i < arr.size(); i++) {
            // Push the smallest element from the heap to the result
            result.push_back(minHeap.top());
            minHeap.pop();

            // Push the current element into the heap
            minHeap.push(arr[i]);
        }

        // Pop remaining elements from the heap
        while (!minHeap.empty()) {
            result.push_back(minHeap.top());
            minHeap.pop();
        }

        // Return the sorted array
        return result;
    }
};

//Merge M sorted Lists
Problem Statement: Given heads of k sorted linked lists as an array called heads, merge them into one single sorted linked list and return the head of that list.
Brute:store all the list''s element in one list and then sort that list
Optimal:// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Compare {//*************************** IMP:(comparator in general asks "Does a comes before b?" ->so for ascending it means: is a less than b?)
//for Priority Queue(min-hea) it means: "Does a have lower priority than b"(only exception that asks a little differently because in Heap the highest priority element is at top)
public:
    // Comparator to order ListNode pointers based on node values
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val;
    }
};

class Solution {
public:
    // Function to merge k sorted linked lists using a min-heap
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Create a min-heap (priority queue) with custom comparator
        priority_queue<ListNode*, vector<ListNode*>, Compare> pq;

        // Push the head of each non-empty list into the heap
        for (auto list : lists) {
            if (list != NULL)
                pq.push(list);
        }

        // Create a dummy node to build the result list
        ListNode* dummy = new ListNode(0);
        ListNode* tail = dummy;

        // While the heap is not empty
        while (!pq.empty()) {
            // Extract the node with the smallest value
            ListNode* smallest = pq.top();
            pq.pop();

            // Add it to the result list
            tail->next = smallest;
            tail = tail->next;

            // If there's a next node, push it into the heap
            if (smallest->next != NULL)
                pq.push(smallest->next);
        }

        // Return the head of the merged list
        return dummy->next;
    }
};

//Replace elements by its rank in the array
Given an array of N integers, the task is to replace each element of the array by its rank in the array.
optimal:sort and find rank

//Task Scheduler
Problem Statement: You are given a list of tasks represented by uppercase English letters ('A' to 'Z'), and an integer n representing a cooldown interval between two same tasks. Each task takes exactly 1 CPU interval to complete. Tasks can be executed in any order, but identical tasks must be separated by at least n intervals, during which the CPU may remain idle or execute other tasks.
Return the minimum number of CPU intervals required to complete all the tasks .
sub-Optimal:
 int leastInterval(vector<char>& tasks, int n) {

        // Step 1: Count frequency of each task
        unordered_map<char, int> freq;
        for (char task : tasks) {
            freq[task]++;
        }

        // Step 2: Use max heap to always pick task with highest frequency
        priority_queue<int> maxHeap;
        for (auto& entry : freq) {
            maxHeap.push(entry.second);
        }

        // Total time required
        int time = 0;

        // Step 3: Process tasks in cycles of size (n + 1)
        while (!maxHeap.empty()) {

            // Store tasks executed in this cycle
            vector<int> temp;

            // Set number of tasks allowed in this cycle
            int cycle = n + 1;

            // Counter to track how many tasks we run in this cycle
            int i = 0;

            // Keep running tasks until cycle ends or heap gets empty
            while (i < cycle && !maxHeap.empty()) {

                // Get the most frequent remaining task
                int cnt = maxHeap.top();
                maxHeap.pop();

                // Reduce its count as we’re running it once
                cnt--;

                // If the task still has pending frequency, store it for later
                if (cnt > 0) {
                    temp.push_back(cnt);
                }

                // Count 1 unit of time for this task
                time++;

                // Move to next slot in the cycle
                i++;
            }

            // Step 4: Push leftover tasks of this cycle back into the heap
            for (int val : temp) {
                maxHeap.push(val);
            }

            // Step 5: If heap is empty, no need to count idle time
            if (maxHeap.empty()) break;

            // Step 6: Add idle time to complete the cycle (if any slots were left)
            time += (cycle - i);
        }

        // Return the total time needed
        return time;
    }

//846. Hand of Straights
Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.
Given an integer array hand where hand[i] is the value written on the ith card and an integer groupSize, return true if she can rearrange the cards, or false otherwise.
Optimal:bool isNStraightHand(vector<int>& hand, int groupSize) {
        if(hand.size()%groupSize !=0)return false;
        map<int,int> freq;
        for(auto i:hand){
            freq[i]++;
        }
        auto it=freq.begin();
        while(it!=freq.end()){
            if(it->second==0){++it;continue;}
            int start=it->first;
            int count=it->second;
            for(int i=0;i<groupSize;i++){
                if(freq[start+i]<count)return false;
                freq[start+i]-=count;
            }
            it++;
        }
        return true;
    }

//Design Twitter--***********(sets,unordered maps,heaps)
Problem Statement: Create a simplified version of a social media platform similar to Twitter. Users should be able to post tweets, follow or unfollow other users, and view the 10 most recent tweets in their news feed.
Implement the Twitter class as follows:
Twitter(): Initializes the Twitter object.
void postTweet(int userId, int tweetId): Composes a new tweet with ID tweetId by the user userId. All tweetIds will be unique.
List<Integer> getNewsFeed(int userId): Retrieves the 10 most recent tweet IDs in the user's news feed. The news feed should only show posts from users the user follows or from the user themself, with tweets arranged from most recent to least recent.
void follow(int followerId, int followeeId): The user with ID followerId started following the user with ID followeeId. Input will be given such that followerId is not already following followeeId at the time of function call.
void unfollow(int followerId, int followeeId): The user with ID followerId unfollowed the user with ID followeeId. Input will be given such that followerId is following followeeId at the time of function call.
optimal:class Twitter {
private:
    unordered_map<int,vector<pair<int,int>>> tweets;
        unordered_map<int,unordered_set<int>> following;
        int time;
public:
    Twitter() {
        time=0;
    }

    void postTweet(int userId, int tweetId) {
        tweets[userId].push_back({time++,tweetId});
    }

    vector<int> getNewsFeed(int userId) {
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;

        for(auto i:tweets[userId]){
            pq.push(i);
            if(pq.size()>10){pq.pop();}
        }
        for(auto j:following[userId]){
            for(auto i:tweets[j]){
            pq.push(i);
            if(pq.size()>10){pq.pop();}
        }
        }
        vector<int> res;
        while(!pq.empty()){
            res.push_back(pq.top().second);
            pq.pop();
        }
        reverse(res.begin(),res.end());
        return res;
    }

    void follow(int followerId, int followeeId) {
        following[followerId].insert(followeeId);
    }

    void unfollow(int followerId, int followeeId) {
        following[followerId].erase(followeeId);
    }
};

//Minimum Cost to Connect Sticks
You have some sticks with positive integer lengths. You can connect any two sticks together to form a longer stick by paying a cost equal to the sum of their lengths. You must connect all the sticks into one single stick.
Return the minimum cost of connecting all the sticks.
Optimal:class Solution {
public:
    int connectSticks(vector<int>& sticks) {
        // Edge case: only one stick, no connection needed
        if (sticks.size() == 1) return 0;

        // Min-heap to always get the two smallest sticks
        priority_queue<int, vector<int>, greater<int>> minHeap;

        // Push all sticks into the heap
        for (int stick : sticks) {
            minHeap.push(stick);
        }

        int totalCost = 0;

        // Keep combining until only one stick remains
        while (minHeap.size() > 1) {
            // Get two smallest sticks
            int first = minHeap.top();
            minHeap.pop();

            int second = minHeap.top();
            minHeap.pop();

            // Cost to combine them
            int cost = first + second;
            totalCost += cost;

            // Push combined stick back
            minHeap.push(cost);
        }

        return totalCost;
    }
};

//Kth largest element in a stream of running integers
Problem Statement: Implement a class KthLargest to find the kth largest number in a stream. It should have the following methods:
KthLargest(int k, int [] nums) Initializes the object with the integer k and the initial stream of numbers in nums
int add(int val) Appends the integer val to the stream and returns the kth largest element in the stream.
Note that it is the kth largest element in the sorted order, not the kth distinct element.
Optimal:class KthLargest {
private:
    priority_queue<int,vector<int>,greater<>> pq;//min-heap
    int k;
public:
    KthLargest(int p, vector<int>& nums) {
        k=p;
        for(auto i:nums){
            pq.push(i);
            if(pq.size()>k){
                pq.pop();
            }
        }
    }

    int add(int val) {
        pq.push(val);
        if(pq.size()>k)pq.pop();
        return pq.top();
    }
};

//Maximum Sum Combination/
Problem Statement: Given two integer arrays nums1 and nums2 and an integer k, return the maximum k valid sum combinations from all possible sum combinations using the elements of nums1 and nums2. A valid sum combination is made by adding one element from nums1 and one element from nums2. Return the answer in non-increasing order.
solution:
->Sort both input arrays in descending order.
->Use a max heap to store tuples of (sum, index1, index2).
->Push the initial max sum formed by the first elements of both arrays into the heap.
->Maintain a set to track visited index pairs.
->Repeat the following k times:
->Pop the current largest sum from the heap.
->Add it to the result.
->Push the next two possible combinations (moving one index forward in either array) into the heap if not visited.
->Return the result list after collecting k sums.
Code:vector<int> maxCombinations(vector<int>& nums1, vector<int>& nums2, int k) {

        // Sort both arrays in descending order
        sort(nums1.begin(), nums1.end(), greater<int>());
        sort(nums2.begin(), nums2.end(), greater<int>());

        // Max-heap to store pairs with their indices
        priority_queue<tuple<int, int, int>> maxHeap;

        // Set to keep track of visited index pairs
        set<pair<int, int>> visited;

        // Push the initial maximum pair (nums1[0] + nums2[0])
        maxHeap.push({nums1[0] + nums2[0], 0, 0});
        visited.insert({0, 0});

        // Vector to store the result
        vector<int> result;

        // Extract top k elements from the heap
        while(k-- && !maxHeap.empty()) {

            // Get the current maximum sum and its indices
            auto [sum, i, j] = maxHeap.top();
            maxHeap.pop();

            // Add this sum to the result
            result.push_back(sum);

            // If (i + 1, j) is valid and not visited, add it to the heap
            if(i + 1 < nums1.size() && !visited.count({i + 1, j})) {
                maxHeap.push({nums1[i + 1] + nums2[j], i + 1, j});
                visited.insert({i + 1, j});
            }

            // If (i, j + 1) is valid and not visited, add it to the heap
            if(j + 1 < nums2.size() && !visited.count({i, j + 1})) {
                maxHeap.push({nums1[i] + nums2[j + 1], i, j + 1});
                visited.insert({i, j + 1});
            }
        }

        // Return the final k max combinations
        return result;
    }

//295. Find Median from Data Stream
The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.
For example, for arr = [2,3,4], the median is 3.
For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.
Implement the MedianFinder class:
MedianFinder() initializes the MedianFinder object.
void addNum(int num) adds the integer num from the data stream to the data structure.
double findMedian() returns the median of all elements so far. Answers within 10-5 of the actual answer will be accepted.
Optimal:class MedianFinder {
    priority_queue<int,vector<int>> left;
    priority_queue<int,vector<int>,greater<>> right;
public:
    MedianFinder() { }
    void addNum(int num) {
        left.push(num);
        right.push(left.top());
        left.pop();
        if(left.size()<right.size()){
            left.push(right.top());
            right.pop();
        }
    }
    double findMedian() {
        if(left.size()==right.size())
            return (left.top()+right.top())/2.0;
        return left.top();
    }
};


//**************************************************************************************************************************

//GREEDY ALGORITHMS ----------------------------------------------------------------------------------------

//455. Assign Cookies
Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content. Your goal is to maximize the number of your content children and output the maximum number.
Optimal:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(),g.end());
        sort(s.begin(),s.end());
        int max=0;
        auto i=g.begin();
        auto j=s.begin();
        while(i!=g.end()&&j!=s.end()){
            if(*i<=*j){
                max++;
                i++;j++;
                continue;
            }
            else {
                j++;
            }
        }
        return max;
        }

//678. Valid Parenthesis String
Given a string s containing only three types of characters: '(', ')' and '*', return true if s is valid.
The following rules define a valid string:
Any left parenthesis '(' must have a corresponding right parenthesis ')'.
Any right parenthesis ')' must have a corresponding left parenthesis '('.
Left parenthesis '(' must go before the corresponding right parenthesis ')'.
'*' could be treated as a single right parenthesis ')' or a single left parenthesis '(' or an empty string "".

Approach: recursive way -> three branches(for each *) : Time:3^N and Space: O(N)
Approach: Dynamic Prog. : Time: O(N^2) and Space: O(N^2)
Optimal Approach: Using range of min and max ,Time:O(N)
bool checkValidString(string s) {
        int min=0,max=0;
        for(auto ch:s){
            if(ch=='('){// '(' leads to  +1
                min+=1;
                max+=1;
            }
            else if(ch==')'){// ')' needs -1
                min-=1;
                max-=1;
            }
            else {// * can lead to -1,0,+1
                min-=1;
                max+=1;
            }
            if(min<0)min=0;
            if(max<0)return false;
        }
        return (min==0);
    }

//N meetings in one room
Problem Statement: There is one meeting room in a firm. You are given two arrays, start and end each of size N. For an index ‘i’, start[i] denotes the starting time of the ith meeting while end[i] will denote the ending time of the ith meeting. Find the maximum number of meetings that can be accommodated if only one meeting can happen in the room at a particular time. Print the order in which these meetings will be performed.
Optimal:
vector<int> maxMeetings(vector<int>& start, vector<int>& end) {
        // Store meetings as (end_time, start_time, original_index)
        vector<tuple<int, int, int>> meetings;
        for (int i = 0; i < start.size(); i++) {
            // i+1 for 1-based indexing
            meetings.push_back({end[i], start[i], i + 1});

        }

        // Sort by end time
        sort(meetings.begin(), meetings.end());

        vector<int> result; // To store meeting indices
        int lastEnd = -1;

        // Traverse sorted meetings
        for (auto& m : meetings) {
            int e = get<0>(m);
            int s = get<1>(m);
            int idx = get<2>(m);

            // If meeting starts after last one ends
            if (s > lastEnd) {
                // Store index
                result.push_back(idx);
                // Update last end time
                lastEnd = e;
            }
        }
        return result;
    }

//55. Jump Game
You are given an integer array nums. You are initially positioned at the array''s first index, and each element in the array represents your maximum jump length at that position.
Return true if you can reach the last index, or false otherwise.
Optimal:
bool canJump(vector<int>& nums) {
        int maxInd=0;
        int n=nums.size();
        for(int i=0;i<n;i++){
            if(maxInd<i)return false;
            maxInd=max(maxInd,i+nums[i]);

        }
        return true;

// 45. Jump Game II
You are given a 0-indexed array of integers nums of length n. You are initially positioned at index 0.
Each element nums[i] represents the maximum length of a forward jump from index i. In other words, if you are at index i, you can jump to any index (i + j) where:
0 <= j <= nums[i] and
i + j < n
Return the minimum number of jumps to reach index n - 1. The test cases are generated such that you can reach index n - 1.
Optimal:
int jump(vector<int>& nums) {
        int jump=0;int l=0,r=0;
        int n=nums.size();git
        int farthest=0;
        while(r<n-1){
            farthest=0;
            for(int i=l;i<=r;i++){
                farthest=max(farthest,i+nums[i]);
            }
            l=r+1;jump++;
            r=farthest;
        }
        return jump;
```
