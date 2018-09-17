function num=countone(a)
    num=0;
    for i=1:length(a)
        if a(i)==1
            num=num+1;
        end
    end
end