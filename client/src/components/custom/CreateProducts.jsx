import React, { useRef, useState } from 'react';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const CreateProducts = () => {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;
    const price = e.target.price.value;
    const stock = e.target.stock.value;

    // Validations
    if (!name || !description || !price || !stock || !category || images.length === 0) {
      return toast('Error: Please fill in all fields and upload images.');
    }

    if (
      name.trim() === '' ||
      description.trim() === '' ||
      price <= 0 ||
      stock <= 0 ||
      category.trim() === ''
    ) {
      return toast('Field cannot be empty or less than 1');
    }

    if (images.length < 2) {
      return toast('Please upload at least 2 images');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    images.forEach((image) => formData.append('images', image.file));

    setIsLoading(true);

    try {
      await axios.post(
        import.meta.env.VITE_API_URL + '/create-product',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast('Product added successfully!');

      // Reset form
      e.target.reset();
      setImages([]);
      setCategory('');
    } catch (error) {
      toast('Error in adding product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Enter the details for the new product</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col lg:flex-row lg:w-[70vw]">
          {/* Left Side - Text Inputs */}
          <CardContent className="w-full">
            <div className="space-y-2 mt-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" placeholder="Enter product name" required />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                min="0"
                name="price"
                type="number"
                placeholder="Enter product price"
                required
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                min="0"
                name="stock"
                type="number"
                placeholder="Enter product stock"
                required
              />
            </div>
          </CardContent>

          {/* Right Side - Category and Images */}
          <CardContent className="w-full">
            <div className="space-y-2 mt-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perfume & Fragrances">Perfume & Fragrances</SelectItem>
                  <SelectItem value="Stickers Emblems Key Chains">Stickers Emblems Key Chains</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Exterior">Exterior</SelectItem>
                  <SelectItem value="Security Badges">Security Badges</SelectItem>
                  <SelectItem value="Lightening">Lightening</SelectItem>


                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="images">Product Images</Label>
              <div className="flex flex-wrap gap-4">
                {/* Uploaded images */}
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt="Uploaded"
                      className="rounded-md object-cover w-[100px] h-[100px]"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Remove Image</span>
                    </Button>
                  </div>
                ))}

                {/* Upload button */}
                {images.length < 4 && (
                  <Button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-1"
                    variant="outline"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-xs">Upload</span>
                  </Button>
                )}
              </div>

              {/* Hidden file input */}
              <Input
                ref={fileInputRef}
                onChange={handleImageUpload}
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
          </CardContent>
        </div>

        <CardFooter>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default CreateProducts;
