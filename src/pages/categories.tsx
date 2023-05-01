import React, { useContext } from 'react';
import CategoryService from '../services/category/category.service';
import styled from 'styled-components';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { 
    Box, 
    ListItem, 
    IconButton, 
    Checkbox, 
    Toolbar, 
    AppBar, 
    FormControlLabel, 
} from '@mui/material';
import AddCategoryButton from '../components/button/AddCategoryButton';
import ConfirmAction from '../components/button/ConfirmAction';
import AppContext from '../components/context/AppContext';
import { useSelector } from 'react-redux';
import { selectCategories } from '../slices/category.slice';

interface CategoryPageProps {
    categories?: any[];
}

const CategoryPage: React.FC = () => {
    const categories = useSelector(selectCategories);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [displayedCategories, setDisplayedCategories] = React.useState([]);
    const Context = useContext(AppContext);

    React.useEffect(() => {
        setDisplayedCategories(categories);
    }, [categories]);
    const handleDeleteCategory = (category, cb) => {
        return CategoryService.deleteCategory(category.id, )
        .then((res) => {
            setDisplayedCategories([...displayedCategories.filter((c) => c.id != category.id)]);
            if(cb)cb(); 
        })
        .catch((err) => {
            Context.displayErrorMessage(err.message)
            if(cb)cb(); 
        });
    };

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
    }

    const handleAddCategory = (category, onSuccess) => {
        CategoryService.saveCategory({ name: category })
        .then((res) => {
            setDisplayedCategories([res, ...displayedCategories]);
            if(onSuccess) onSuccess();
        })
        .catch((err) => console.log(err));
    }

    return ( 
        <Wrapper className='category-page'>
            <Box sx={{
                width: '100%',
                maxWidth: '800px'
            }}>
                <AppBar position='sticky' color='default' sx={{ paddingRight: '24px', paddingLeft: '2px' }}>
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '0',
                    }} variant='dense'>
                        <FormControlLabel control={<Checkbox size='small' />} label="Select All" />
                        {/* <Button variant='text' startIcon={<AddIcon/>}>Add</Button> */}
                        <AddCategoryButton onSave={handleAddCategory} icon={<AddIcon/>}>Add</AddCategoryButton>
                    </Toolbar>
                </AppBar>
                <List
                    sx={{
                        maxWidth: '800px',
                        backgroundColor: 'none',
                    }}
                    >
                    {displayedCategories.map((category) => {
                        return (
                            <ListItem 
                                key={category.id}
                                sx={{
                                    backgroundColor: 'white'
                                }}
                                secondaryAction={
                                    <ConfirmAction 
                                        title={category.name}
                                        content='Do you realy want to remove this category?'
                                        onConfirm={(cb)=>handleDeleteCategory(category, cb)} >
                                        <DeleteIcon/>
                                    </ConfirmAction>
                                }
                                disablePadding
                            >
                                <ListItemButton sx={{paddingRight: '64px'}} onClick={handleCategorySelection}>
                                    <Checkbox size='small'/>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText sx={{
                                        display: "flex",
                                        justifyContent: 'space-between'
                                    }} primary={category?.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    &.category-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 50px 50px;
        background-color: var(--light-gray);
    }
`;

 
export default CategoryPage;