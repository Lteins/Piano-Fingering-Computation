function result=DExamine(note,i)
    if i>1
        if isa(note(i),'SNote')==1
            bound1=i-1;
            bound2=i;
        else
            x=i-1;
        
            while x>=1&&isa(note(x),'MNote')==1&&note(x).id==note(i).id
                x=x-1;
            end

            x=x+1;
            bound1=x;
            bound2=i;
        end

        result=0;

        for x=bound1:bound2-1
            result=result+Diff(note,x,i);
        end
    else
        result=0;
    end
end