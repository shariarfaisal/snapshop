'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContentService } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AboutPageContentPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroDescription: '',
    missionStatement: '',
    visionStatement: '',
  });

  const [coreValues, setCoreValues] = useState<Array<{ title: string; description: string }>>([]);
  const [achievements, setAchievements] = useState<Array<{ number: string; label: string }>>([]);
  const [whyChooseItems, setWhyChooseItems] = useState<Array<{ icon: string; title: string; description: string }>>([]);

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'about-page'],
    queryFn: adminContentService.getAboutPageContent,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        heroTitle: content.heroTitle || '',
        heroDescription: content.heroDescription || '',
        missionStatement: content.missionStatement || '',
        visionStatement: content.visionStatement || '',
      });
      setCoreValues(content.coreValues || []);
      setAchievements(content.achievements || []);
      setWhyChooseItems(content.whyChooseItems || []);
    }
  }, [content]);

  const updateMutation = useMutation({
    mutationFn: adminContentService.updateAboutPageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'about-page'] });
      toast({
        title: 'Success',
        description: 'About page content updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update content',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      coreValues,
      achievements,
      whyChooseItems,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Core Values handlers
  const addCoreValue = () => {
    setCoreValues([...coreValues, { title: '', description: '' }]);
  };

  const updateCoreValue = (index: number, field: 'title' | 'description', value: string) => {
    const newValues = [...coreValues];
    newValues[index][field] = value;
    setCoreValues(newValues);
  };

  const removeCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  // Achievements handlers
  const addAchievement = () => {
    setAchievements([...achievements, { number: '', label: '' }]);
  };

  const updateAchievement = (index: number, field: 'number' | 'label', value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index][field] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Why Choose Items handlers
  const addWhyChooseItem = () => {
    setWhyChooseItems([...whyChooseItems, { icon: '', title: '', description: '' }]);
  };

  const updateWhyChooseItem = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const newItems = [...whyChooseItems];
    newItems[index][field] = value;
    setWhyChooseItems(newItems);
  };

  const removeWhyChooseItem = (index: number) => {
    setWhyChooseItems(whyChooseItems.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">About Page Content</h1>
          <p className="text-gray-600">Manage your institution's story and values</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main heading and introduction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Page Title</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                placeholder="About Our Institution"
              />
            </div>

            <div>
              <Label htmlFor="heroDescription">Page Description</Label>
              <Textarea
                id="heroDescription"
                name="heroDescription"
                value={formData.heroDescription}
                onChange={handleChange}
                placeholder="Tell your institution's story..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Card>
          <CardHeader>
            <CardTitle>Mission & Vision</CardTitle>
            <CardDescription>Define your institution's goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="missionStatement">Mission Statement</Label>
              <Textarea
                id="missionStatement"
                name="missionStatement"
                value={formData.missionStatement}
                onChange={handleChange}
                placeholder="Our mission is..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="visionStatement">Vision Statement</Label>
              <Textarea
                id="visionStatement"
                name="visionStatement"
                value={formData.visionStatement}
                onChange={handleChange}
                placeholder="Our vision is..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <Card>
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>Define your institution's core values and principles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {coreValues.map((value, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`coreValue-title-${index}`}>Title</Label>
                    <Input
                      id={`coreValue-title-${index}`}
                      value={value.title}
                      onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                      placeholder="Innovation"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeCoreValue(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`coreValue-description-${index}`}>Description</Label>
                  <Textarea
                    id={`coreValue-description-${index}`}
                    value={value.description}
                    onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                    placeholder="Leveraging technology to create better educational experiences."
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addCoreValue}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Core Value
            </Button>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Showcase key milestones and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2 items-end p-4 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`achievement-number-${index}`}>Number</Label>
                  <Input
                    id={`achievement-number-${index}`}
                    value={achievement.number}
                    onChange={(e) => updateAchievement(index, 'number', e.target.value)}
                    placeholder="500+"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`achievement-label-${index}`}>Label</Label>
                  <Input
                    id={`achievement-label-${index}`}
                    value={achievement.label}
                    onChange={(e) => updateAchievement(index, 'label', e.target.value)}
                    placeholder="Schools Using E-Campus"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeAchievement(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addAchievement}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us</CardTitle>
            <CardDescription>Highlight reasons to choose your institution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {whyChooseItems.map((item, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`whyChoose-icon-${index}`}>Icon</Label>
                    <Input
                      id={`whyChoose-icon-${index}`}
                      value={item.icon}
                      onChange={(e) => updateWhyChooseItem(index, 'icon', e.target.value)}
                      placeholder="🎯"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`whyChoose-title-${index}`}>Title</Label>
                    <Input
                      id={`whyChoose-title-${index}`}
                      value={item.title}
                      onChange={(e) => updateWhyChooseItem(index, 'title', e.target.value)}
                      placeholder="Easy to Use"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeWhyChooseItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`whyChoose-description-${index}`}>Description</Label>
                  <Textarea
                    id={`whyChoose-description-${index}`}
                    value={item.description}
                    onChange={(e) => updateWhyChooseItem(index, 'description', e.target.value)}
                    placeholder="Intuitive interface designed for educators and administrators"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addWhyChooseItem}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Why Choose Item
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            size="lg"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
