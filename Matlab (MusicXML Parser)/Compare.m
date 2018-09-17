function finger=Compare(pitch,finger1,finger2)

	%Computing the number of turning finger
	Turn_num1=0; 
	Turn_num2=0;
	for i=2:length(pitch)
		if (pitch(i)-pitch(i-1))*(finger1(i)-finger1(i-1))<0
			Turn_num1=Turn_num1+1;
		end

		if (pitch(i)-pitch(i-1))*(finger2(i)-finger2(i-1))<0
			Turn_num2=Turn_num2+1;
		end
	end

	 if Turn_num1<Turn_num2
	 	finger=finger1;
	 	return
 	end

 	if Turn_num1>Turn_num2
	 	finger=finger2;
	 	return
 	end

 	Ex1=0; 
 	Ex2=0; %Initialise the number of extension finger
 	Dis_Ex1=zeros(1:5);
 	Dis_Ex2=zeros(1:5);

 	Cut1=0; 
 	Cut2=0;%Initialise the number of shrinking finger
 	Dis_Cut1=zeros(1:5);
 	Dis_Cut2=zeros(1:5);

 	for i=2:length(pitch)
 		temp1=(pitch(i)-pitch(i-1))-(finger1(i)-finger1(i-1));
 		temp2=(pitch(i)-pitch(i-1))-(finger2(i)-finger2(i-1));

 		if temp1>0
 			Ex1=Ex1+temp1;
 			Dis_Ex1(min(finger1(i),finger1(i-1)))=Dis_Ex1(min(finger1(i),finger1(i-1)))+temp1;
		end
		if temp1<0
			Cut1=Cut1-temp1;
			Dis_Cut1(min(finger1(i),finger1(i-1)))=Dis_Cut1(min(finger1(i),finger1(i-1)))-temp1;
		end

		if temp2>0
 			Ex2=Ex2+temp2;
 			Dis_Ex2(min(finger2(i),finger2(i-1)))=Dis_Ex2(min(finger2(i),finger2(i-1)))+temp2;
		end
		if temp2<0
			Cut2=Cut2-temp2;
			Dis_Cut2(min(finger2(i),finger2(i-1)))=Dis_Cut2(min(finger1(i),finger1(i-1)))-temp2;
		end
	end

	%Comparing the number of shrinking finger
	if Cut1<Cut2
		finger=finger1;
		return
	end
	if Cut1>Cut2
		finger=finger2;
		return
	end

	%Comparing the number of extension finger
	if Ex1<Ex2
		finger=finger1;
		return
	end
	if Ex1>Ex2
		finger=finger2;
		return
	end

	if Ex1~=0&&Ex2~=0
		x1=(Dis_Ex1(1)+Dis_Ex1(2)*2+Dis_Ex1(3)*3+Dis_Ex1(4)*4)/Ex1;
		x2=(Dis_Ex2(1)+Dis_Ex2(2)*2+Dis_Ex2(3)*3+Dis_Ex2(4)*4)/Ex2;
	else
		x1=0;
		x2=0
	end

	if x1<x2
		finger=finger1;
		return
	end

	if x1>x2
		finger=finger2;
		return
	end

	if Cut1~=0&&Cut2~=0
		y1=(Dis_Cut1(1)+Dis_Cut1(2)*2+Dis_Cut1(3)*3+Dis_Cut1(4)*4)/Cut1;
		y2=(Dis_Cut2(1)+Dis_Cut2(2)*2+Dis_Cut2(3)*3+Dis_Cut2(4)*4)/Cut2;
	else
		y1=0;
		y2=0;
	end

	if y1<y2
		finger=finger1;
		return
	end

	if y1>y2
		finger=finger2;
		return
	end

	warning('The Two group of finger are supposed to be the same');
	finger=finger1;
end