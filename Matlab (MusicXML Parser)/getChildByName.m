function ChildList=getChildByName(node,varargin)
	ChildList=[];
	Child=node.getFirstChild();
	while Child~=[]
		result=0;
		for i=1:length(varargin)
			if Child.getNodeName()==varargin{i}
				result=1;
			end
		end
		
		if result==1;
			ChildList=[ChildList Child];
		end
		Child=Child.getNextSibling();
	end
end