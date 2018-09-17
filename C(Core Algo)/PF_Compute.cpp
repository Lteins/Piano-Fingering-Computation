#include<stdio.h>
#include<math.h>
int readin(double *pitch)
{
 FILE *file=fopen("out.txt","r");
 
 int i,x;
 //int b,c;
 int length;
 fscanf(file,"%d",&length);
 printf("length is %d\n",length);
 
 for(i=1;i<=length;i++)
 {
  fscanf(file,"%d",&x);
  *(pitch+i)=x;
  printf("%d\n",x);
 }

 fclose(file);	
 return length;
}
  
void enterin(int n, double *pitch) //ÊäÈëÖ¸·¨ 
{
 int i;
 for (i=1;i<=n;i++)
 {
  scanf("%lf",pitch+i); 
 }
}

int turn(int start,double *pitch,int *turningpoint, int n  ) //Ô¤´¦Àí×ªÕÛµã 
{
 int a,b;
 double diff;
 int z=1; //Í³¼Æ¸öÊý 
 a=start;
 b=a+1;
 diff=(*(pitch+a))-(*(pitch+b));
 for(a=start+1;a<=n-1;a++)
 {
  b=a+1;
  if(diff*((*(pitch+a))-(*(pitch+b)))<0)
  {
   z++;
   *(turningpoint+z)=a; 
  }
  diff=(*(pitch+a))-(*(pitch+b));
 }
 return z;
}

int idealfinger(int *finger,double *pitch, int now, int **storeidealfinger,int end,int mode) //²â¶¨ÀíÏëÖ¸·¨ 
{
   int i=now;
   double up=*(pitch+i);
   double down=*(pitch+i);
   int up_num=0;
   int down_num=0;
   int result;
   if (now==end)
   {result=(*(finger+now-1)+*(pitch+now)-*(pitch+now-1));
    if (result>=1&&result<=5)
    return result;
    if(result<1)
    return 1;
    if(result>5)
    return 5;
   } 
   while(up-down<=8)
   {
    i++;
    if (i>end)
    break;
  
    if(*(pitch+i)>up)
    {
    
	   up=*(pitch+i);
     up_num++;
	  }
    	if(*(pitch+i)<down)
        {
        down=*(pitch+i);
        down_num++;
    	}
       }
       i--;
     
     
       
       int x;
       int y;
       int min=100;
       double num;
     
       for(x=1;x<=5;x++)
       {
        num=0;
        for(y=now+1;y<=i;y++)
        {
         if ((*(pitch+y))<(*(pitch+now)-(x-1)))
         num=num+(*(pitch+now)-(x-1))-(*(pitch+y));
         if ((*(pitch+y))>(*(pitch+now)+(5-x)))
         num=num+(*(pitch+y))-(*(pitch+now)+(5-x));
        }
        if (num<min)
        {
         min=num;
         result=x;
        }
       }
      int z=0;
       for(x=1;x<=5;x++)
       {
        num=0;
        for(y=now+1;y<=i;y++)
        {
         if ((*(pitch+y))<(*(pitch+now)-(x-1)))
         num=num+(*(pitch+now)-(x-1))-(*(pitch+y));
         if ((*(pitch+y))>(*(pitch+now)+(5-x)))
         num=num+(*(pitch+y))-(*(pitch+now)+(5-x));
        }
      
        if (num==min)
        {
         z++;
       
         *(*(storeidealfinger+now)+z)=x;
        }
       }

      if (mode==0)
      return  result;  //·µ»ØµÃµ½µÄµÚÒ»¸öÀíÏëÖ¸·¨ 
     
      if(mode==1)    //·µ»ØÀíÏëÖ¸·¨µÄ¸öÊý 
      return z;
  
}

int difficulty_add(double *pitch,int pitch_now,int *finger,int finger_now,int **D)
{
 double z;
 int difficulty;
 if  ((*(pitch+pitch_now)-*(pitch+pitch_now-1))*(*(finger+finger_now)-*(finger+finger_now-1))>0||(*(pitch+pitch_now)-*(pitch+pitch_now-1))*(*(finger+finger_now)-*(finger+finger_now-1))>0==0)
	{
    z=*(pitch+pitch_now)-*(pitch+pitch_now-1);
    int a,b,temp;
    a=finger[finger_now-1];
    b=finger[finger_now];
    if (a>b)
    {temp=a;
    a=b;
    b=temp;}
	difficulty=*(*(D+a)+b);
    if (z<0)
	{
	z=-z;
	}
	if (z>difficulty)
	return 1; 
    else
    return 0;
   }
 else
 {
  return 0;
 }
}

//»ùÓÚËÑË÷ÕÒµ½ÀíÏë½ÚµãÊµÐÐ×ªÖ¸ 
int ThreeRuleTurn_Up(int end, int start, int last,double *pitch, int *finger,int **storeidealfinger )
{
     int rawresult[10];                     
     int processresult[10];
     int finalresult=-1;
     int diff=100;
     int max=0;
     int x;
	 int y=0;
     if(*(finger+start)!=1)
     {
      if (last<end)
  	   {
	   for(x=start;x<=last;x++)  //´ÖÂÔÉ¸Ñ¡³ö½á¹û (rawresult£¨£©´¢´æµÄÊÇ×ªÎ»×éµÄµÚÒ»¸öÒô 
       {
        if (*(pitch+x+1)-*(pitch+x)<=3&&*(finger+x)!=1&&*(finger+x)!=5)
        {
         if(floor(*(pitch+x))<*(pitch+x))
		 {y++; 
	     rawresult[y]=x;
		 }
		 else
	     {
	      if(floor(*(pitch+x+1))==*(pitch+x+1))
          {
           y++; 
	       rawresult[y]=x;
		  }
		 }
		}
       }
       }
	   else
	   {
	   for(x=start;x<=last-1;x++)  //´ÖÂÔÉ¸Ñ¡³ö½á¹û (rawresult£¨£©´¢´æµÄÊÇ×ªÎ»×éµÄµÚÒ»¸öÒô 
       {
        if (*(pitch+x+1)-*(pitch+x)<=3&&*(finger+x)!=1&&*(finger+x)!=5)
        {
          if(floor(*(pitch+x))<*(pitch+x))
		 {y++; 
	     rawresult[y]=x;
		 }
		 else
	     {
	      if(floor(*(pitch+x+1))==*(pitch+x+1))
          {
           y++; 
	       rawresult[y]=x;}
		 }
        }
       }
	   }
     }
	 else  
	 {
	   if (last<end)
  	   {
	    for(x=start+1;x<=last;x++)  //´ÖÂÔÉ¸Ñ¡³ö½á¹û (rawresult£¨£©´¢´æµÄÊÇ×ªÎ»×éµÄµÚÒ»¸öÒô 
       {
        if (*(pitch+x+1)-*(pitch+x)<=3&&*(finger+x)!=1&&*(finger+x)!=5)
        {
          if(floor(*(pitch+x))<*(pitch+x))
		 {y++; 
	     rawresult[y]=x;
		 }
		 else
	     {
	      if(floor(*(pitch+x+1))==*(pitch+x+1))
          {
           y++; 
	       rawresult[y]=x;}
		 }
        }
       }
       }
	   else
	   {
	   for(x=start+1;x<=last-1;x++)  //´ÖÂÔÉ¸Ñ¡³ö½á¹û (rawresult£¨£©´¢´æµÄÊÇ×ªÎ»×éµÄµÚÒ»¸öÒô 
       {
        if (*(pitch+x+1)-*(pitch+x)<=3&&*(finger+x)!=1&&*(finger+x)!=5)
        {
          if(floor(*(pitch+x))<*(pitch+x))
		 {y++; 
	     rawresult[y]=x;
		 }
		 else
	     {
	      if(floor(*(pitch+x+1))==*(pitch+x+1))
          {
           y++; 
	       rawresult[y]=x;}
		 }
        }
       }
	  }
	}	 
	 int z=0;
      for(x=1;x<=y;x++)
       {
		if((idealfinger(finger,pitch,rawresult[x]+1,storeidealfinger,end,0)-1)<=diff)
        {
         diff= (idealfinger(finger,pitch,rawresult[x]+1,storeidealfinger,end,0)-1); 
        }
       }
       for(x=1;x<=y;x++)
       {
        if((idealfinger(finger,pitch,rawresult[x]+1,storeidealfinger,end,0)-1)==diff)
        {
          z++;
	      processresult[z]=rawresult[x];
        }
       }
      int min=0;
	  for(x=1;x<=z;x++)
      {
       if (processresult[x]>min)
	   min=processresult[x];     
      }
	  if (min==0)
	  {
	   return 0;
	  }
      else
      return min;
} 


//»ùÓÚËÑË÷µÄ¶ÎÂäÓÅ»¯ 
int Search(double *R_D,int *finger,int level,double *pitch,int point,int now,int n,int **R,int storey,int i,int *last,int **D_,int **storeidealfinger_,int mode) 
{
 int x,y;
 storey++;
 for(x=point+1;x<=now;x++)
 {
 i++;
 int *the=*(R+i);
 if(storey==1)
 {for(y=point;y<=x-1;y++)
 *(the+y-point+1)=*(last+y);
 if (mode==1)
 *(the+x-point+1)=*(last+x)+1;
 else
 *(the+x-point+1)=*(last+x)-1;
 }
 else
 {for(y=point;y<=x-1;y++)
 *(the+y-point+1)=*(last+y-point+1);
 if(mode==1)
 *(the+x-point+1)=*(last+x-point+1)+1;
 else
 *(the+x-point+1)=*(last+x-point+1)-1;
 }
 y=x+1;
 int success=1;
 int difficulty=0;
 while(y<=now) 
 {  
  if (mode==1) 
  { 
   if(*(pitch+y)>*(pitch+y-1))
  *(the+y-point+1)=*(the+y-1-point+1)+1;
   if(*(pitch+y)==*(pitch+y-1))
   *(the+y-point+1)=*(the+y-1-point+1);
   if (*(the+y-point+1)>5)
   {
    success=0;
    break;
   }
   if(difficulty_add(pitch,y,the,y-point+1,D_)==1)
   {
    while(difficulty_add(pitch,y,the,y-point+1,D_)==1 && *(the+y-point+1)<5)
    {
    *(the+y-point+1)=*(the+y-point+1)+1;
    }
    if (difficulty_add(pitch,y,the,y-point+1,D_)==1)
    {
     success=0;
	 break;
    }
   }
  }
  else
  {
   if(*(pitch+y)<*(pitch+y-1))
  *(the+y-point+1)=*(the+y-1-point+1)-1;
   if(*(pitch+y)==*(pitch+y-1))
   *(the+y-point+1)=*(the+y-1-point+1);
   if (*(the+y-point+1)<1)
   {
    success=0;
    break;
   }
   if(difficulty_add(pitch,y,the,y-point+1,D_)==1)
   {
    while(difficulty_add(pitch,y,the,y-point+1,D_)==1 && *(the+y-point+1)>1)
    {
    *(the+y-point+1)=*(the+y-point+1)-1;
    }
    if (difficulty_add(pitch,y,the,y-point+1,D_)==1)
    {
     success=0;
	 break;
    }
   }
  }
  y++;
 } 
 y--;
 if (success!=0)
 {
 if (mode==1)
 level=idealfinger(finger,pitch,now,storeidealfinger_,n,0)-*(the+now-point+1);
 else
 level=-(idealfinger(finger,pitch,now,storeidealfinger_,n,0)-*(the+now-point+1));
 }
 else
 level=level-100;
 
 if (level==0)
 {
  for(y=1;y<=now-point+1;y++)   //y change to the number of the series
  {
   difficulty=difficulty+the[1]+(pitch[y+point-1]-pitch[point])-the[y];
  }
  *(R_D+i)=difficulty;
 }
 if (level<0)
 {
  *(R_D+i)=-1;
 }
 if (level>0)
 {
  i=Search(R_D,finger,level,pitch,point,now,n,R,storey,i,last,D_,storeidealfinger_,mode);
 }
 }
 return i;
}


int main(void)
{
 FILE *file_out=fopen("cout.txt","w");
 fprintf(file_out,"start");
 
 double pitch[100];
 int finger[100];
 int storeidealfinger[100][6];
 int *storeidealfinger_[100];
 int D[6][6];
 int *D_[6];
 int R[3200][6];
 int *R_[3200];
 double R_D[3200];
 int turningpoint[100];
 int turningpoint_num;
 int n;
 int x,y,z,i;
 int difficulty;

 for(x=1;x<100;x++)
 {
  storeidealfinger_[x]=storeidealfinger[x];
 }

 for(x=1;x<=5;x++)
 {
  D_[x]=D[x];
 }

 for(x=1;x<=3200;x++)
 {
  R_[x]=R[x];
 }

D[1][5]=9;D[2][5]=6;D[3][5]=3;D[4][5]=2;D[5][5]=0;D[1][4]=8;D[2][4]=3;D[3][4]=2;D[4][4]=0;D[1][3]=6;D[2][3]=3;D[3][3]=0;D[1][2]=5;D[2][2]=0;D[1][1]=0;
int numidealfinger[100];
//scanf("%d",&n); 
//enterin(n,pitch);
n=readin(pitch);

turningpoint_num=turn(1,pitch,turningpoint,n)+1;

turningpoint[1]=1;
turningpoint[turningpoint_num]=n;
difficulty=0;
int point=1,min,result;
int next=2;
int level;
finger[1]=idealfinger(finger,pitch,1,storeidealfinger_,n,0);
x=2;
int h;


while(x<=n)
{
  printf("The %dth of %d key\n",x,n);

if (x==n)
{
	//上行情况
	if(pitch[x]>pitch[x-1])
	{
		finger[x]=finger[x-1]+pitch[x]-pitch[x-1];
		if (finger[x]>5)
			finger[x]=5;
	}
	else//下行情况
	{
		finger[x]=finger[x-1]-(pitch[x-1]-pitch[x]);
		if (finger[x]<1)
			finger[x]=1;
	}	
	break;
}
 y=0;

 //利用顺序指法估测下一个音符的弹奏方式
 if(pitch[x]>pitch[x-1])
 finger[x]=finger[x-1]+1;
 if(pitch[x]==pitch[x-1])
 finger[x]=finger[x-1];
 if(pitch[x]<pitch[x-1])
 finger[x]=finger[x-1]-1;
//**********************

//确定接下来函数 ThreeRuleTurn 的其实扫描范围
if (turningpoint_num>0)
 {
  for(y=1;y<=turningpoint_num;y++)
  {
  if(x<=*(y+turningpoint))
  break;
  }
 }
 
 if (y!=0)
 {
 if(point<*(turningpoint+y))
 point=*(turningpoint+y-1);
 }
 //********************

//修正顺序指法
 //修正出现0或者6指的情况
 if (finger[x]>5)
 {
  z=ThreeRuleTurn_Up(n,point,x-1,pitch,finger,storeidealfinger_); 

  if(z!=0)
  {finger[z+1]=1;
  x=z+1;//回溯
  point=x;
  }
  else
  {
   finger[x]=idealfinger(finger,pitch, x,storeidealfinger_,n,0);
   point=x;
  }
 }
 
 if(finger[x]<1)
 {

 finger[x]=idealfinger(finger,pitch,x,storeidealfinger_,n,0);
 z=pitch[x-1]-pitch[x];//完成指法超出的修正

//根据音区修正
 if (z<3)
 {
  if (finger[x]>4)
  finger[x]=4;
 }
 else
 {
 
 if (z<4)
 {
  if(finger[x]>3)
  finger[x]=3;
 }
 else
 {
 if (z<5)
 {
  if (finger[x]>2)
  finger[x]=2;
 }

 }
 }

 point=x;//更新回溯范围边界
 }

//************************************
 //开始难度修正
 if (difficulty_add(pitch,x,finger,x,D_)==1)
 {
  if (pitch[x]-pitch[x-1]>=0)//**************************************上行情况
  {
  while(difficulty_add(pitch,x,finger,x,D_)==1 && finger[x]<5)
  {
  finger[x]=finger[x]+1;
  }

  if (difficulty_add(pitch,x,finger,x,D_)==1)
  {
  z=ThreeRuleTurn_Up(n,point,x-1,pitch,finger,storeidealfinger_); 
  if (z!=0)
  {finger[z+1]=1;
  x=z+1;
  point=x;
  }
  else
  {
   finger[x]=idealfinger(finger,pitch, x,storeidealfinger_,n,0);
  }
  }

  }
  else//***************************************************下行情况
  {
  while(difficulty_add(pitch,x,finger,x,D_)==1 && finger[x]>1)
  {
  finger[x]=finger[x]-1;
  }
  if (difficulty_add(pitch,x,finger,x,D_)==1)
  {
  z=ThreeRuleTurn_Up(n,point,x-1,pitch,finger,storeidealfinger_); 
  
  if (z!=0)
  {finger[z+1]=1;
  x=z+1;
  point=x;
  }
  else
  {
   finger[x]=idealfinger(finger,pitch, x,storeidealfinger_,n,0);
  }
  }
  }
 }

 if (x==turningpoint[next])//处理是转点的情况
 {

	finger[x]=idealfinger(finger,pitch, x,storeidealfinger_,n,0);  
 }
 //****************************转点处理完成
 x++;
}

printf("\n\n");
for(x=1;x<=n;x++)
{printf("%d\n",finger[x]);  
 fprintf(file_out,"%d\n",finger[x]);
}
scanf("%d",&x);
fclose(file_out);
return 0;
}

